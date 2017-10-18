import 'reflect-metadata';

import { db } from './db';
import { serverPromise } from './server';

const init = async () => {
  await db;
  const server = await serverPromise;
  await server.start();
  return server;
};

init()
  .then((server) => console.log(`Server running at: ${server.info!.uri}`))
  .catch((err) => console.error(err));
