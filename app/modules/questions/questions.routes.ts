import { RouteConfiguration } from 'hapi';
import {
  createQuestionHandler,
  getQuestionsHandler
} from './questions.handler';
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
    description: 'Creates a question',
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

export const questionsRoutes: RouteConfiguration[] = [
  getQuestionsRoute,
  createQuestionRoute
];
