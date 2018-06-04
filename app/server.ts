import * as fs from 'fs';
import * as Hapi from 'hapi';
import * as HapiRaven from 'hapi-raven';
import * as HapiSwagger from 'hapi-swagger';
import * as Inert from 'inert';
import * as Vision from 'vision';
import { questionsRoutes } from './modules/questions/questions.routes';
import { authRoutes } from './modules/tokens/tokens.routes';
import { auth } from './plugins/auth';
import { configService } from './services/configService';

const version = fs.readFileSync('./.version', 'utf8');

const swaggerOptions = {
  info: {
    version
  },
  jsonEditor: true,
  auth: false
};

const server = new Hapi.Server();

server.connection({
  port: 3002,
  host: '0.0.0.0',
  routes: {
    cors: {
      origin: ['*'],
      credentials: true
    },
    response: {
      modify: true,
      options: {
        allowUnknown: true,
        convert: true,
        stripUnknown: { objects: true }
      }
    }
  }
});

const serverPromise = new Promise<Hapi.Server>((resolve, reject) => {
  server.register(
    [
      {
        register: HapiRaven,
        options: {
          dsn: configService.getRavenUrl(),
          release: version,
          environment: process.env.NODE_ENV,
          autoBreadcrumbs: true,
          captureUnhandledRejections: true
        }
      },
      Inert,
      Vision,
      {
        options: swaggerOptions,
        register: HapiSwagger
      },
      auth
    ],
    (err) => {
      if (err) {
        return reject(err);
      }

      process.on(
        'unhandledRejection',
        (reason, promise: Promise<any> & any) => {
          const error = new Error(`unhandledRejection: ${reason}`);

          console.error(error);
          try {
            console.log(promise.toJSON().rejectionReason);
            // tslint:disable-next-line:no-empty
          } catch (e) {}

          if (server.plugins['hapi-raven']) {
            server.plugins['hapi-raven'].client.captureException(error, {
              extra: {
                promise
              }
            });
          }
        }
      );

      server.ext('onPreResponse', (request, reply) => {
        const INTERNAL_SERVER_ERROR_CODE = 500;
        if (
          request.response &&
          request.response.output &&
          request.response.output.statusCode === INTERNAL_SERVER_ERROR_CODE
        ) {
          const e = request.response as Hapi.Response & { stack: string };
          console.error(new Date(), e.name, e.message, e.stack);

          if (server.plugins['hapi-raven']) {
            server.plugins['hapi-raven'].client.captureException(e, {
              request
            });
          }

          return reply(new Error('Internal server error'));
        }

        return reply.continue();
      });

      server.route({
        config: {
          auth: false,
          description: 'Test endpoint',
          tags: ['api'],
          handler(_request, reply) {
            reply(`<h1>fefaq</h1><p>stay a while and listen</p>`);
          }
        },
        method: 'GET',
        path: '/'
      });

      server.route({
        config: {
          description: 'Test endpoint',
          tags: ['api'],
          handler(_request, reply) {
            reply(`Dziala`);
          }
        },
        method: 'GET',
        path: '/no'
      });

      server.route([...authRoutes, ...questionsRoutes]);

      return resolve(server);
    }
  );
});

export { serverPromise };
