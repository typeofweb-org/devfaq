import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';
import { getQuestionsSchema } from './questions.schemas.js';

// method: 'GET',
// path: '/questions',

// method: 'POST',
// path: '/questions',

// method: 'PATCH',
// path: '/questions/{id}',

// method: 'GET',
// path: '/questions/{id}',

// method: 'DELETE',
// path: '/questions/{id}',

const questionsPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/questions',
    method: 'GET',
    schema: getQuestionsSchema,
    async handler(request, reply) {
      // const currentUser = getCurrentUser(request);

      const { category, level, status, limit, offset, order, orderBy } = request.query;

      const where = {
        ...(category && { categoryId: category }),
        ...(level && { levelId: { in: level } }),
        // ...(status && isAdmin(request) ? { _statusId: status } : { _statusId: 'accepted' }),
        ...{ statusId: 'accepted' },
      };

      // @todo also get votes
      const [total, questions] = await Promise.all([
        fastify.db.question.count({
          where,
        }),
        fastify.db.question.findMany({
          where,
          take: limit,
          skip: offset,
          ...(order &&
            orderBy && {
              orderBy: {
                [order]: orderBy,
              },
            }),
        }),
      ]);

      const data = questions.map((q) => {
        return {
          id: q.id,
          question: q.question,
          _categoryId: q.categoryId,
          _levelId: q.levelId,
          _statusId: q.statusId,
          acceptedAt: q.acceptedAt?.toISOString(),
          votesCount: 0,
          currentUserVotedOn: false,
          // votesCount: q.votesCount,
          // currentUserVotedOn: q.didUserVoteOn,
        };
      });

      return { data, meta: { total } };
    },
  });
};

export default questionsPlugin;
