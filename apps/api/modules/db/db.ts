import { Prisma, PrismaClient } from '@prisma/client';
import type { FastifyPluginAsync } from 'fastify';
import FP from 'fastify-plugin';
import { PrismaErrorCode } from './prismaErrors.js';
import { isPrismaError } from './prismaErrors.util.js';

declare module 'fastify' {
  interface FastifyInstance {
    db: PrismaClient;
  }
}

const db: FastifyPluginAsync = async (fastify, options) => {
  const prisma = new PrismaClient();

  fastify.addHook('onClose', () => prisma.$disconnect());
  fastify.decorate('db', prisma);

  const originalErrorHandler = fastify.errorHandler;

  fastify.setErrorHandler((error, request, reply) => {
    if (isPrismaError(error)) {
      switch (error.code) {
        case PrismaErrorCode.RecordNotFound:
          return fastify.httpErrors.notFound(error.message);
      }
    }

    originalErrorHandler(error, request, reply);
  });
};

const dbPlugin = FP(db);

export default dbPlugin;
