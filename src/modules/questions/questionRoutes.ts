import { Server } from 'hapi';
import Boom from 'boom';
import {
  GetQuestionsRequestSchema,
  GetQuestionsResponseSchema,
  CreateQuestionRequestSchema,
  CreateQuestionResponseSchema,
  GetOneQuestionRequestSchema,
  GetOneQuestionResponseSchema,
} from './questionSchemas';
import { Question } from '../../models/Question';
import { QUESTION_STATUS } from '../../models-consts';

export const questionsRoutes = {
  async init(server: Server) {
    await server.route({
      method: 'GET',
      path: '/questions',
      options: {
        auth: { mode: 'try' },
        tags: ['api', 'questions'],
        validate: GetQuestionsRequestSchema,
        description: 'Returns questions',
        response: {
          schema: GetQuestionsResponseSchema,
        },
      },
      async handler(request) {
        const { category, level, limit, offset } = request.query;

        const where = {
          ...(category && { _categoryId: category }),
          ...(level && { _levelId: level }),
          // ...(status && { _statusId: status }),
          _statusId: QUESTION_STATUS.ACCEPTED,
        };

        const total = await Question.count({
          where,
        });

        const questions = await Question.findAll({
          where,
          limit,
          offset,
          subQuery: false,
          raw: true,
        });

        const data = questions.map(q => {
          return {
            id: q.id,
            question: q.question,
            _categoryId: q._categoryId,
            _levelId: q._levelId,
            _statusId: q._statusId,
            acceptedAt: q.acceptedAt,
          };
        });

        return { data, meta: { total } };
      },
    });

    await server.route({
      method: 'POST',
      path: '/questions',
      options: {
        tags: ['api', 'questions'],
        validate: CreateQuestionRequestSchema,
        description: 'Creates a question',
        notes: `When user is not an admin, it won't publish the question`,
        response: {
          schema: CreateQuestionResponseSchema,
        },
      },
      async handler(request) {
        const { question, level, category } = request.payload;

        const newQuestion = await Question.create({
          question,
          _levelId: level,
          _categoryId: category,
          _statusId: QUESTION_STATUS.PENDING,
        });

        const data = {
          id: newQuestion.id,
          question: newQuestion.question,
          _categoryId: newQuestion._categoryId,
          _levelId: newQuestion._levelId,
          _statusId: newQuestion._statusId,
          acceptedAt: newQuestion.acceptedAt,
        };

        return { data };
      },
    });

    await server.route({
      method: 'GET',
      path: '/questions/{id}',
      options: {
        auth: { mode: 'try' },
        tags: ['api', 'questions'],
        validate: GetOneQuestionRequestSchema,
        description: 'Returns one question',
        response: {
          schema: GetOneQuestionResponseSchema,
        },
      },
      async handler(request) {
        const { id } = request.params;

        const question = await Question.findOne({
          where: {
            id,
            _statusId: QUESTION_STATUS.ACCEPTED,
          },
        });

        if (!question) {
          throw Boom.notFound();
        }

        const data = {
          id: question.id,
          question: question.question,
          _categoryId: question._categoryId,
          _levelId: question._levelId,
          _statusId: question._statusId,
          acceptedAt: question.acceptedAt,
        };

        return { data };
      },
    });
  },
};
