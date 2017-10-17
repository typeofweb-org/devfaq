import "reflect-metadata";

import * as Inert from 'inert';
import * as Vision from 'vision';
import * as HapiSwagger from 'hapi-swagger';

import { server } from "./server";
import { db } from "./db";

import * as pgk from '../package.json'
import * as Hapi from 'hapi';

const swaggerOptions = {
  info: {
    version: (<any>pgk).version as string
  }
};

db.then(() => {
  server.register([
    Inert as Hapi.PluginFunction<{}>,
    Vision as Hapi.PluginFunction<{}>,
    {
      register: HapiSwagger,
      options: swaggerOptions
    }
  ], () => {
    server.start((err) => {
      if (err) {
        throw err;
      }
      console.log(`Server running at: ${server.info!.uri}`);
    });
  })
}).catch(err => console.error(err))

