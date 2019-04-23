import { Server } from 'hapi';
import Boom from 'boom';
import {
  CreateQuestionVoteRequestSchema,
  CreateQuestionVoteResponseSchema,
} from './questionVotesRoutes';
import { QuestionVote } from '../../models/QuestionVote';
import { Question } from '../../models/Question';
import { User } from '../../models/User';

export const questionVotesRoutes = {
  async init(server: Server) {
    await server.route({
      method: 'POST',
      path: '/question-votes',
      options: {
        auth: {
          mode: 'required',
          scope: ['admin', 'user-{payload._userId}'],
        },
        tags: ['api', 'questions', 'votes'],
        validate: CreateQuestionVoteRequestSchema,
        description: 'Votes on a question',
        response: {
          schema: CreateQuestionVoteResponseSchema,
        },
      },
      async handler(request) {
        const { _userId, _questionId } = request.payload;

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
  },
};
