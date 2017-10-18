import * as Hapi from 'hapi';
import * as HapiSwagger from 'hapi-swagger';
import * as Inert from 'inert';
import * as Vision from 'vision';
import * as pgk from '../package.json';

import { auth } from './plugins/auth';

const swaggerOptions = {
  info: {
    version: (pgk as any).version as string,
  },
};

const server = new Hapi.Server();

server.connection({ port: 3000, host: 'localhost' });

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

    return resolve(server);
  });
});

export { serverPromise };
