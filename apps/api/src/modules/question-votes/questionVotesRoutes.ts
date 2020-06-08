import Boom from '@hapi/boom';
import { Server } from '@hapi/hapi';

import { definitions } from '../../../apiTypes';
import { Question } from '../../models/Question';
import { QuestionVote } from '../../models/QuestionVote';
import { User } from '../../models/User';

import {
  CreateQuestionVoteRequestSchema,
  CreateQuestionVoteResponseSchema,
} from './questionVotesSchemas';

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
      async handler(request): Promise<definitions['postQuestionVotes200Response']> {
        const {
          _userId,
          _questionId,
        } = (request.query as unknown) as definitions['postQuestionVotesRequestQuery'];

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
        } = (request.query as unknown) as definitions['deleteQuestionVotesRequestQuery'];

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
