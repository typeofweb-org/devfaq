import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  deleteQuestionByIdSchema,
  getQuestionByIdSchema,
  getQuestionsSchema,
  patchQuestionByIdSchema,
  postQuestionsSchema,
} from './questions.schemas.js';
import { validateCategory, validateLevels, validateStatus } from './questions.validators.js';

const questionsPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(import('./questions.utils.js'));

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/questions',
    method: 'GET',
    schema: getQuestionsSchema,
    async handler(request, reply) {
      // const currentUser = getCurrentUser(request);
      const { category, level, status, limit, offset, order, orderBy } = request.query;
      const levels = level?.split(',');

      await Promise.all([
        validateCategory(fastify, category),
        validateLevels(fastify, levels),
        validateStatus(fastify, status),
      ]);

      const where = {
        ...(category && { categoryId: category }),
        ...(levels && { levelId: { in: levels } }),
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

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/questions',
    method: 'POST',
    schema: postQuestionsSchema,
    async handler(request, reply) {
      const { question, level, category } = request.body;

      await Promise.all([validateCategory(fastify, category), validateLevels(fastify, [level])]);

      const newQuestion = await fastify.db.question.create({
        data: {
          question,
          levelId: level,
          categoryId: category,
          statusId: 'pending',
        },
      });

      const data = {
        id: newQuestion.id,
        question: newQuestion.question,
        _categoryId: newQuestion.categoryId,
        _levelId: newQuestion.levelId,
        _statusId: newQuestion.statusId,
        acceptedAt: newQuestion.acceptedAt?.toISOString(),
        currentUserVotedOn: false,
        votesCount: 0,
      };

      return { data };
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/questions/:id',
    method: 'PATCH',
    schema: patchQuestionByIdSchema,
    async handler(request, reply) {
      const { id } = request.params;

      const { question, level, category, status } = request.body;

      await Promise.all([
        validateCategory(fastify, category),
        validateLevels(fastify, [level]),
        validateStatus(fastify, status),
      ]);

      // const currentUser = getCurrentUser(request);

      const q = await fastify.db.question.update({
        where: { id },
        data: {
          question,
          QuestionLevel: { connect: { id: level } },
          QuestionCategory: { connect: { id: category } },
          QuestionStatus: { connect: { id: status } },
        },
      });

      const data = {
        id: q.id,
        question: q.question,
        _categoryId: q.categoryId,
        _levelId: q.levelId,
        _statusId: q.statusId,
        acceptedAt: q.acceptedAt?.toISOString(),
        currentUserVotedOn: false,
        votesCount: 0,
        // currentUserVotedOn: currentUser
        //   ? await Question.didUserVoteOn(currentUser, question)
        //   : false,
        // votesCount: question.votesCount,
      };

      return { data };
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/questions/:id',
    method: 'GET',
    schema: getQuestionByIdSchema,
    async handler(request, reply) {
      const { id } = request.params;

      const question = await fastify.db.question.findFirst({
        where: {
          id,
          statusId: 'accepted',
        },
      });

      if (!question) {
        return reply.notFound();
      }

      const data = {
        id: question.id,
        question: question.question,
        _categoryId: question.categoryId,
        _levelId: question.levelId,
        _statusId: question.statusId,
        acceptedAt: question.acceptedAt?.toISOString(),
        currentUserVotedOn: false,
        votesCount: 0,
        // currentUserVotedOn: currentUser
        //   ? await Question.didUserVoteOn(currentUser, question)
        //   : false,
        // votesCount: question.votesCount,
      };

      return { data };
    },
  });

  // @todo admin only
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/questions/:id',
    method: 'DELETE',
    schema: deleteQuestionByIdSchema,
    async handler(request, reply) {
      const { id } = request.params;

      await fastify.db.question.delete({ where: { id } });

      return reply.status(204);
    },
  });
};

export default questionsPlugin;
