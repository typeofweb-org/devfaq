import { Server } from '@hapi/hapi';
import Boom from '@hapi/boom';
import {
  CreateQuestionVoteRequestSchema,
  CreateQuestionVoteResponseSchema,
} from './questionVotesSchemas';
import { QuestionVote } from '../../models/QuestionVote';
import { Question } from '../../models/Question';
import { User } from '../../models/User';
import { definitions } from '../../../apiTypes';

export const questionVotesRoutes = {
  async init(server: Server) {
    await server.route({
      method: 'POST',
      path: '/question-votes',
      options: {
        auth: {
          mode: 'required',
          access: {
            scope: ['admin', 'user-{query._userId}'],
          },
        },
        tags: ['api', 'questions', 'votes'],
        validate: CreateQuestionVoteRequestSchema,
        description: 'Votes on a question',
        response: {
          schema: CreateQuestionVoteResponseSchema,
        },
      },
      async handler(request): Promise<definitions['postQuestionvotes200Response']> {
        const {
          _userId,
          _questionId,
        } = (request.query as unknown) as definitions['postQuestionvotesRequestQuery'];

        const question = await Question.findByPk(_questionId, { attributes: ['id'] });
        if (!question) {
          throw Boom.badRequest(`Question with id=${_questionId} doesn't exist!`);
        }

        const user = await User.findByPk(_userId, { attributes: ['id'] });
        if (!user) {
          throw Boom.badRequest(`User with id=${_userId} doesn't exist!`);
        }

        const [questionVote] = await QuestionVote.findOrCreate({
          raw: true,
          where: {
            _userId,
            _questionId,
          },
          defaults: {
            _userId,
            _questionId,
          },
        });

        return {
          data: {
            _userId: questionVote._userId,
            _questionId: questionVote._questionId,
          },
        };
      },
    });

    await server.route({
      method: 'DELETE',
      path: '/question-votes',
      options: {
        auth: {
          mode: 'required',
          access: {
            scope: ['admin', 'user-{query._userId}'],
          },
        },
        tags: ['api', 'questions', 'votes'],
        validate: CreateQuestionVoteRequestSchema,
        description: 'Votes on a question',
        response: {
          emptyStatusCode: 204,
        },
      },
      async handler(request) {
        const {
          _userId,
          _questionId,
        } = (request.query as unknown) as definitions['deleteQuestionvotesRequestQuery'];

        await QuestionVote.destroy({
          where: {
            _userId,
            _questionId,
          },
        });

        return null;
      },
    });
  },
};
