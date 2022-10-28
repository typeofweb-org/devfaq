import Fastify from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

const fastify = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      strict: 'log',
      keywords: ['kind', 'modifier'],
    },
  },
}).withTypeProvider<TypeBoxTypeProvider>();

await fastify.register(import('@fastify/sensible'));
await fastify.register(import('@fastify/swagger'));
await fastify.register(import('@fastify/swagger-ui'), {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
  },
});
await fastify.register(import('./modules/db/db.js'));
await fastify.register(import('./modules/auth/auth.js'));
await fastify.register(import('./modules/questions/questions.routes.js'));

fastify.get(
  '/',
  {
    schema: {
      response: {
        200: Type.String(),
      },
    },
  },
  async () => {
    return `Zostań na chwilę i posłuchaj`;
  }
);

export { fastify };
