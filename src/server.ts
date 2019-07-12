import Boom from 'boom';
import Hapi from 'hapi';
import HapiSwagger from 'hapi-swagger';
import Inert from 'inert';
import Vision from 'vision';
import pkg from '../package.json';
import { getConfig, isProd } from './config';
import * as Sentry from '@sentry/node';
import { handleException } from './utils/utils';
import { helloWorldRoute } from './modules/hello-world/helloWorldRoute';
import { healthCheckRoute } from './modules/health-check/healthCheckRoutes';
import { questionsRoutes } from './modules/questions/questionRoutes';
import AuthPlugin from './plugins/auth';
import { questionVotesRoutes } from './modules/question-votes/questionVotesSchemas';
import * as fs from 'fs';

declare module 'hapi' {
  interface PluginSpecificConfiguration {
    'hapi-swagger'?: {
      payloadType?: 'form' | 'json';
    };
  }
}

const getServer = () => {
  return new Hapi.Server({
    host: '0.0.0.0',
    port: getConfig('PORT'),
    routes: {
      cors: {
        origin: ['*'],
        credentials: true,
      },
      response: {
        modify: true,
        options: {
          allowUnknown: false,
          convert: true,
          stripUnknown: { objects: true },
        },
      },
      validate: {
        async failAction(_request, _h, err) {
          if (isProd()) {
            // In prod, log a limited error message and throw the default Bad Request error.
            handleException(err, Sentry.Severity.Warning);

            throw Boom.badRequest(`Invalid request payload input`);
          } else {
            handleException(err, Sentry.Severity.Warning);
            throw err;
          }
        },
      },
    },
  });
};

export async function getServerWithPlugins() {
  const server = getServer();
  server.events.on({ name: 'request', channels: 'error' }, (request, event, _tags) => {
    const baseUrl = `${server.info.protocol}://${request.info.host}`;

    Sentry.withScope(scope => {
      scope.setExtra('timestamp', request.info.received);
      scope.setExtra('remoteAddress', request.info.remoteAddress);

      // const user =
      //   request.auth &&
      //   request.auth.credentials &&
      //   request.auth.credentials.session &&
      //   request.auth.credentials.session._user;
      // if (user) {
      //   scope.setUser({
      //     id: user.id,
      //     username: user.email,
      //     email: user.email,
      //     json: user.toJSON(),
      //   });
      // }

      const extraData = {
        method: request.method,
        query_string: request.query,
        headers: request.headers,
        cookies: request.state,
        url: baseUrl + request.path,
        data: ['get', 'head'].includes(request.method) ? '<unavailable>' : request.payload,
      };

      scope.setExtra('request', extraData);

      handleException(event.error);
    });
  });

  const swaggerOptions: HapiSwagger.RegisterOptions = {
    info: {
      title: `${pkg.name} Documentation`,
      version: getConfig('ENV') + '-' + pkg.version + '-' + fs.readFileSync('.version', 'utf-8'),
    },
    auth: false,
  };

  await server.register([
    { plugin: Inert },
    { plugin: Vision },
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ] as Array<Hapi.ServerRegisterPluginObject<unknown>>);

  await server.register(
    {
      plugin: AuthPlugin,
      options: {
        cookieDomain: getConfig('COOKIE_DOMAIN'),
        isProduction: isProd(),
        cookiePassword: getConfig('COOKIE_PASSWORD'),
        githubClientId: getConfig('GITHUB_CLIENT_ID'),
        githubClientSecret: getConfig('GITHUB_CLIENT_SECRET'),
        githubPassword: getConfig('GITHUB_PASSWORD'),
      },
    },
    {
      routes: {
        prefix: '/oauth',
      },
    }
  );

  await helloWorldRoute.init(server);
  await healthCheckRoute.init(server);
  await questionsRoutes.init(server);
  await questionVotesRoutes.init(server);

  await server.route({
    method: 'GET',
    path: '/public',
    options: {
      auth: {
        mode: 'try',
        strategy: 'session',
      },
    },
    handler(request) {
      if (request.auth.isAuthenticated) {
        return request.auth.credentials;
      }

      return 'Not logged in!';
    },
  });

  return server;
}
