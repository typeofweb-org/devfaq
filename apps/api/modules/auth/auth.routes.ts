import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { randomUUID } from 'crypto';
import { FastifyPluginAsync } from 'fastify';
import ms from 'ms';
import { meSchema } from './auth.schemas.js';

const validateSocialLogin = (sl: unknown): sl is Record<string, string | number> => {
  if (sl === null || sl === undefined || typeof sl !== 'object' || Array.isArray(sl)) {
    return false;
  }
  return Object.values(sl).every((val) => typeof val === 'string' || typeof val === 'number');
};

const authRoutesPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/auth/sessions',
    method: 'POST',
    schema: {
      description: 'Log in',
      tags: ['auth'],
    },
    async handler(request, reply) {
      const user = await fastify.db.user.findFirst({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          socialLogin: true,
          UserRole: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!user) {
        throw fastify.httpErrors.notFound(`User not found!`);
      }

      const socialLogin = validateSocialLogin(user.socialLogin) ? user.socialLogin : null;

      await request.session.regenerate();
      request.session.data = {
        id: randomUUID(),
        validUntil: new Date(Date.now() + ms('7 days')).toISOString(),
        keepMeSignedIn: true,
        User: { ...user, socialLogin },
      };

      return { data: request.session.data };
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/auth/me',
    method: 'GET',
    schema: {
      description: 'Get currently logged-in user',
      tags: ['auth'],
      response: {
        200: Type.Object({ data: meSchema }),
      },
    },
    async handler(request, reply) {
      if (!request.session.data) {
        throw fastify.httpErrors.unauthorized();
      }

      return { data: request.session.data };
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/auth/me',
    method: 'DELETE',
    schema: {
      description: 'Log out',
      tags: ['auth'],
      response: {
        204: {},
      },
    },
    async handler(request, reply) {
      if (!request.session.data) {
        throw fastify.httpErrors.unauthorized();
      }

      request.session.destroy();

      return reply.status(204).send();
    },
  });
};

export default authRoutesPlugin;
