import 'reflect-metadata';

import * as HapiSwagger from 'hapi-swagger';
import * as Inert from 'inert';
import * as Vision from 'vision';

import { db } from './db';
import { server } from './server';

import * as Hapi from 'hapi';
import * as pgk from '../package.json';

const swaggerOptions = {
  info: {
    version: (pgk as any).version as string,
  },
};

db.then(() => {
  server.register([
    Inert as Hapi.PluginFunction<{}>,
    Vision as Hapi.PluginFunction<{}>,
    {
      options: swaggerOptions,
      register: HapiSwagger,
    },
  ], () => {
    server.start((err) => {
      if (err) {
        throw err;
      }
      console.log(`Server running at: ${server.info!.uri}`);
    });
  });
}).catch((err) => console.error(err));
