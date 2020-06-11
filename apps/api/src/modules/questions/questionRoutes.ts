import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import { IFindOptions } from 'sequelize-typescript';

import { definitions } from '../../../apiTypes';
import { getDb } from '../../db';
import { Question } from '../../models/Question';
import { findAllQuestions, countAllQuestions } from '../../questions.queries';
import { isAdmin, getCurrentUser } from '../../utils/utils';

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

function columnNameFromQuery(
  orderBy: NonNullable<definitions['getQuestionsRequestQuery']['orderBy']>
): string {
  switch (orderBy) {
    case 'level':
      return '_levelId';
    case 'acceptedAt':
      return 'acceptedAt';
    case 'votesCount':
      return 'votesCount';
  }
}

export const questionsRoutes = {
  async init(server: Hapi.Server) {
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
      async handler(request): Promise<definitions['getQuestions200Response']> {
        const {
          category,
          level,
          status,
          limit,
          offset,
          orderBy,
          order,
        } = request.query as definitions['getQuestionsRequestQuery'];
        const currentUser = getCurrentUser(request);

        const where = {
          category,
          ...(isAdmin(request) ? { status } : { status: 'accepted' }),
          levels: level || [null],
        };

        const db = await getDb();

        const [questions, total] = await Promise.all([
          findAllQuestions.run(
            {
              ...where,
              userId: currentUser?.id,
              orderBy: orderBy ? `${columnNameFromQuery(orderBy)} ${order}, id asc` : `id asc`,
              limit,
              offset,
            },
            db
          ),
          countAllQuestions.run(where, db),
        ]);

        const data = questions.map((q) => {
          return {
            ...q,
            id: q.id,
            acceptedAt: q.acceptedAt?.toISOString(),
            currentUserVotedOn: q.didUserVoteOn,
          };
        }) as definitions['getQuestions200Response']['data'];

        return { data, meta: { total: total[0].count } };
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
      async handler(request): Promise<definitions['postQuestions200Response']> {
        const {
          question,
          level,
          category,
        } = request.payload as definitions['postQuestionsRequestBody'];

        const newQuestion = await Question.create({
          question,
          _levelId: level,
          _categoryId: category,
          _statusId: 'pending',
        });

        const data = {
          id: newQuestion.id,
          question: newQuestion.question,
          _categoryId: newQuestion._categoryId,
          _levelId: newQuestion._levelId,
          _statusId: newQuestion._statusId,
          acceptedAt: newQuestion.acceptedAt?.toISOString(),
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
      async handler(request): Promise<definitions['patchQuestionsId200Response']> {
        const {
          id,
        } = (request.params as unknown) as definitions['patchQuestionsIdRequestPathParams'];

        const q = await Question.scope('withVotes').findByPk(id);

        if (!q) {
          throw Boom.notFound();
        }

        const {
          question,
          level,
          category,
          status,
        } = request.payload as definitions['patchQuestionsIdRequestBody'];

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
          acceptedAt: q.acceptedAt?.toISOString(),
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
      async handler(request): Promise<definitions['getQuestionsId200Response']> {
        const {
          id,
        } = (request.params as unknown) as definitions['getQuestionsIdRequestPathParams'];

        const question = await Question.scope('withVotes').findOne({
          where: {
            id,
            _statusId: 'accepted',
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
          acceptedAt: question.acceptedAt?.toISOString(),
          currentUserVotedOn: currentUser
            ? await Question.didUserVoteOn(currentUser, question)
            : false,
          votesCount: question.votesCount,
        };

        return { data };
      },
    });

    await server.route({
      method: 'DELETE',
      path: '/questions/{id}',
      options: {
        auth: {
          mode: 'required',
          access: {
            scope: ['admin'],
          },
        },
        tags: ['api', 'questions'],
        validate: GetOneQuestionRequestSchema,
        description: 'Deletes one question',
        response: {
          emptyStatusCode: 204,
        },
      },
      async handler(request) {
        const { id } = request.params;

        await Question.destroy({
          where: { id },
        });

        return null;
      },
    });
  },
};
