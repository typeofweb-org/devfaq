import type FastifySessionPlugin from '@fastify/session';
import type { FastifyPluginAsync } from 'fastify';
import FP from 'fastify-plugin';
import ms from 'ms';
import { getConfig } from '../../config/config.js';
import { MeSchema } from './auth.schemas.js';
import { PrismaSessionStore } from './prismaSessionStore.js';

declare module 'fastify' {
  interface FastifyInstance {}

  interface Session {
    data?: MeSchema;
  }
}

const auth: FastifyPluginAsync = async (fastify, options) => {
  const sessionStore = new PrismaSessionStore(fastify.db);

  await fastify.register(import('@fastify/cookie'));
  await fastify.register(import('@fastify/session'), {
    cookieName: 'session',
    unsignSignedCookie: true,
    secret: getConfig('COOKIE_PASSWORD'),
    store: sessionStore as FastifySessionPlugin.SessionStore,
    rolling: true,
    cookie: {
      sameSite: 'lax',
      httpOnly: true,
      secure: getConfig('NODE_ENV') === 'production',
      domain: getConfig('COOKIE_DOMAIN'),
      maxAge: ms('7 days'),
    },
  });

  await fastify.register(import('./auth.routes.js'));
};

const authPlugin = FP(auth);

export default authPlugin;
