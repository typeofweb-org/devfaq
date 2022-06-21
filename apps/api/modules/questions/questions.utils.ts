import type { FastifyPluginAsync } from 'fastify';
import LRUCache from 'lru-cache';
import FP from 'fastify-plugin';
import ms from 'ms';

type Keys =
  | 'questionsGetLevels'
  | 'questionsGetCategories'
  | 'questionsGetStatuses'
  | 'usersGetRoles';
declare module 'fastify' {
  interface FastifyInstance {
    questionsGetLevels: () => Promise<readonly string[]>;
    questionsGetCategories: () => Promise<readonly string[]>;
    questionsGetStatuses: () => Promise<readonly string[]>;
    usersGetRoles: () => Promise<readonly string[]>;
  }
}

const questions: FastifyPluginAsync = async (fastify, options) => {
  const cache = new LRUCache<Keys, readonly string[]>({
    ttl: ms('1 hour'),
    allowStale: true,
    async fetchMethod(key) {
      switch (key) {
        case 'questionsGetLevels':
          return (await fastify.db.questionLevel.findMany()).map((i) => i.id);
        case 'questionsGetCategories':
          return (await fastify.db.questionCategory.findMany()).map((i) => i.id);
        case 'questionsGetStatuses':
          return (await fastify.db.questionStatus.findMany()).map((i) => i.id);
        case 'usersGetRoles':
          return (await fastify.db.userRole.findMany()).map((i) => i.id);
      }
    },
  });

  fastify.decorate('questionsGetLevels', () => cache.fetch('questionsGetLevels'));
  fastify.decorate('questionsGetCategories', () => cache.fetch('questionsGetCategories'));
  fastify.decorate('questionsGetStatuses', () => cache.fetch('questionsGetStatuses'));
  fastify.decorate('usersGetRoles', () => cache.fetch('usersGetRoles'));
};

const questionsUtilsPlugin = FP(questions);

export default questionsUtilsPlugin;
