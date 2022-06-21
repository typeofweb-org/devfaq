import { getConfig } from './config/config.js';
import { fastify } from './server.js';

const start = async () => {
  try {
    await fastify.listen({ port: getConfig('PORT'), host: '127.0.0.1' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
