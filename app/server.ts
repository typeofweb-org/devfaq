import * as Hapi from 'hapi';
import * as HapiSwagger from 'hapi-swagger';
import * as Inert from 'inert';
import * as Vision from 'vision';
import * as pgk from '../package.json';

import { questionsRoutes } from './modules/questions/questions.routes';
import { authRoutes } from './modules/tokens/tokens.routes';
import { auth } from './plugins/auth';

const swaggerOptions = {
  info: {
    version: (pgk as any).version as string,
  },
  jsonEditor: true,
  auth: false
};

const server = new Hapi.Server();

server.connection({
  port: 3000,
  host: '0.0.0.0',
  routes: {
    cors: true,
    response: {
      modify: true,
      options: {
        allowUnknown: true,
        convert: true,
        stripUnknown: { objects: true },
      }
    }
  },
});

const serverPromise = new Promise<Hapi.Server>((resolve, reject) => {
  server.register([
    Inert,
    Vision,
    {
      options: swaggerOptions,
      register: HapiSwagger,
    },
    auth,
  ], (err) => {
    if (err) {
      return reject(err);
    }

    server.ext('onPreResponse', (request, reply) => {
      const INTERNAL_SERVER_ERROR_CODE = 500;
      if (request.response && request.response.output && request.response.output.statusCode === INTERNAL_SERVER_ERROR_CODE) {
        const e = request.response as Hapi.Response & { stack: string };
        console.error(new Date(), e.name, e.message, e.stack);

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
        },
      },
      method: 'GET',
      path: '/',
    });

    server.route({
      config: {
        description: 'Test endpoint',
        tags: ['api'],
        handler(_request, reply) {
          reply(`Dziala`);
        },
      },
      method: 'GET',
      path: '/no',
    });

    server.route([
      ...authRoutes,
      ...questionsRoutes
    ]);

    return resolve(server);
  });
});

export { serverPromise };
