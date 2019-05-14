import { Server } from 'hapi';
import Boom from 'boom';
import Joi from 'joi';
import {
  GetQuestionsRequestSchema,
  GetQuestionsResponseSchema,
  CreateQuestionRequestSchema,
  CreateQuestionResponseSchema,
  GetOneQuestionRequestSchema,
  GetOneQuestionResponseSchema,
  UpdateQuestionRequestSchema,
  UpdateQuestionResponseSchema,
} from './questionSchemas';
import { Question } from '../../models/Question';
import { QUESTION_STATUS } from '../../models-consts';
import { IFindOptions } from 'sequelize-typescript';
import { isAdmin, getCurrentUser } from '../../utils/utils';

type GetQuestionsRequest = Joi.SchemaValue<typeof GetQuestionsRequestSchema>;

type GetQuestionsRequestQuery = NonNullable<GetQuestionsRequest>['query'];

function columnNameFromQuery(orderBy: NonNullable<GetQuestionsRequestQuery['orderBy']>) {
  switch (orderBy) {
    case 'level':
      return '_levelId';
    default:
      return orderBy;
  }
}

function getOrderFromQuery(
  request: NonNullable<GetQuestionsRequest>
): IFindOptions<Question>['order'] {
  const { order, orderBy } = request.query;
  if (!order || !orderBy) {
    return undefined;
  }

  return [[columnNameFromQuery(orderBy), order], ['id']];
}

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
        const { category, level, status, limit, offset } = request.query;
        const currentUser = getCurrentUser(request);

        const where = {
          ...(category && { _categoryId: category }),
          ...(level && { _levelId: level }),
          ...(status && isAdmin(request)
            ? { _statusId: status }
            : { _statusId: QUESTION_STATUS.ACCEPTED }),
        };

        const total = await Question.count({
          where,
        });

        const order = getOrderFromQuery(request);

        const questions = await Question.findAllWithVotes(
          {
            where,
            limit,
            offset,
            ...(order && { order }),
            subQuery: false,
          },
          currentUser && currentUser.id
        );

        const data = questions.map(q => {
          return {
            id: q.id,
            question: q.question,
            _categoryId: q._categoryId,
            _levelId: q._levelId,
            _statusId: q._statusId,
            acceptedAt: q.acceptedAt,
            votesCount: q.votesCount,
            currentUserVotedOn: q.didUserVoteOn,
          };
        });

        return { data, meta: { total } };
      },
    });

    await server.route({
      method: 'POST',
      path: '/questions',
      options: {
        auth: { mode: 'try' },
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
          currentUserVotedOn: false,
          votesCount: 0,
        };

        return { data };
      },
    });

    await server.route({
      method: 'PATCH',
      path: '/questions/{id}',
      options: {
        auth: {
          mode: 'required',
          scope: ['admin'],
        },
        tags: ['api', 'questions'],
        validate: UpdateQuestionRequestSchema,
        description: 'Updates a question',
        response: {
          schema: UpdateQuestionResponseSchema,
        },
      },
      async handler(request) {
        const { id } = request.params;

        const q = await Question.scope('withVotes').findByPk(id);

        if (!q) {
          throw Boom.notFound();
        }

        const { question, level, category, status } = request.payload;

        const currentUser = getCurrentUser(request);

        q.question = question;
        q._levelId = level;
        q._categoryId = category;
        q._statusId = status;

        await q.save();

        const data = {
          id: q.id,
          question: q.question,
          _categoryId: q._categoryId,
          _levelId: q._levelId,
          _statusId: q._statusId,
          acceptedAt: q.acceptedAt,
          currentUserVotedOn: currentUser ? await Question.didUserVoteOn(currentUser, q) : false,
          votesCount: q.votesCount,
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

        const question = await Question.scope('withVotes').findOne({
          where: {
            id,
            _statusId: QUESTION_STATUS.ACCEPTED,
          },
        });

        if (!question) {
          throw Boom.notFound();
        }

        const currentUser = getCurrentUser(request);

        const data = {
          id: question.id,
          question: question.question,
          _categoryId: question._categoryId,
          _levelId: question._levelId,
          _statusId: question._statusId,
          acceptedAt: question.acceptedAt,
          currentUserVotedOn: currentUser
            ? await Question.didUserVoteOn(currentUser, question)
            : false,
          votesCount: question.votesCount,
        };

        return { data };
      },
    });
  },
};