import { Server } from 'typesafe-hapi';
import { GetQuestionsRequestSchema, GetQuestionsResponseSchema } from './questionSchemas';
import { Question } from '../../models/Question';
import { QUESTION_STATUS } from '../../models-consts';

export const questionsRoutes = {
  async init(server: Server) {
    await server.route({
      method: 'GET',
      path: '/questions',
      options: {
        tags: ['api', 'questions'],
        validate: GetQuestionsRequestSchema,
        description: 'Returns questions',
        response: {
          schema: GetQuestionsResponseSchema,
        },
      },
      async handler(request) {
        const { category, level } = request.query;

        const questions = await Question.findAll({
          where: {
            ...(category && { _categoryId: category }),
            ...(level && { _levelId: level }),
            // ...(status && { _statusId: status }),
            _statusId: QUESTION_STATUS.ACCEPTED,
          },
        });

        return questions.map(q => {
          return {
            id: q.id,
            question: q.question,
            _categoryId: q._categoryId,
            _levelId: q._levelId,
            _statusId: q._statusId,
            acceptedAt: q.acceptedAt,
          };
        });
      },
    });
  },
};
