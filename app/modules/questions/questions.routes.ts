import { RouteConfiguration } from 'hapi';
import {
  createQuestionHandler,
  getQuestionsHandler
} from './questions.handler';
import { partiallyUpdateQuestionHandler } from './questions.handler';
import { PartiallyUpdateQuestionRequestSchema, PartiallyUpdateQuestionResponseSchema } from './questions.schema';
import {
  CreateQuestionRequestSchema,
  CreateQuestionResponseSchema,
  GetQuestionsRequestSchema,
  GetQuestionsResponseSchema
} from './questions.schema';

const getQuestionsRoute: RouteConfiguration = {
  path: '/questions',
  method: 'GET',
  handler: getQuestionsHandler,
  config: {
    auth: { mode: 'optional' },
    tags: ['api', 'questions'],
    validate: GetQuestionsRequestSchema,
    description: 'Returns questions',
    response: {
      schema: GetQuestionsResponseSchema,
    },
  },
};

const createQuestionRoute: RouteConfiguration = {
  path: '/questions',
  method: 'POST',
  handler: createQuestionHandler,
  config: {
    auth: { mode: 'optional' },
    tags: ['api', 'questions'],
    validate: CreateQuestionRequestSchema,
    description: 'Creates a question',
    notes: `When user is not an admin, it won't publish the question`,
    response: {
      schema: CreateQuestionResponseSchema,
    },
  },
};

const partiallyUpdateQuestion: RouteConfiguration = {
  path: '/questions/{id}',
  method: 'PATCH',
  handler: partiallyUpdateQuestionHandler as any, // @todo hapi definitions are incorrect
  config: {
    auth: {
      access: {
        scope: ['admin']
      }
    },
    tags: ['api', 'questions'],
    validate: PartiallyUpdateQuestionRequestSchema,
    description: 'Creates a question',
    notes: `When user is not an admin, it won't publish the question`,
    response: {
      schema: PartiallyUpdateQuestionResponseSchema
    },
  },
};

export const questionsRoutes: RouteConfiguration[] = [
  getQuestionsRoute,
  createQuestionRoute,
  partiallyUpdateQuestion
];
