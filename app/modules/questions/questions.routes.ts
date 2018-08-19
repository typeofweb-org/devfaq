import { RouteConfiguration } from 'hapi';
import {
  createQuestionHandler,
  getQuestionsHandler,
} from './questions.handler';
import {
  deleteQuestionHandler,
  generatePdfHandler,
  partiallyUpdateQuestionHandler,
} from './questions.handler';
import { GeneratePdfRequestSchema } from './questions.schema';
import {
  DeleteQuestionRequestSchema,
  DeleteQuestionResponseSchema,
  PartiallyUpdateQuestionRequestSchema,
  PartiallyUpdateQuestionResponseSchema,
} from './questions.schema';
import {
  CreateQuestionRequestSchema,
  CreateQuestionResponseSchema,
  GetQuestionsRequestSchema,
  GetQuestionsResponseSchema,
} from './questions.schema';

const getQuestionsRoute: RouteConfiguration = {
  path: '/questions',
  method: 'GET',
  handler: getQuestionsHandler,
  config: {
    auth: { mode: 'try' },
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
    auth: { mode: 'try' },
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
        scope: ['admin'],
      },
    },
    tags: ['api', 'questions'],
    validate: PartiallyUpdateQuestionRequestSchema,
    description: 'Updates status of a question',
    notes: `When user is not an admin, it won't have any effect.`,
    response: {
      schema: PartiallyUpdateQuestionResponseSchema,
    },
  },
};

const deleteQuestion: RouteConfiguration = {
  path: '/questions/{id}',
  method: 'DELETE',
  handler: deleteQuestionHandler as any, // @todo hapi definitions are incorrect
  config: {
    auth: {
      access: {
        scope: ['admin'],
      },
    },
    tags: ['api', 'questions'],
    validate: DeleteQuestionRequestSchema,
    description: 'Deletes a question',
    notes: `When user is not an admin, it won't delete the question`,
    response: {
      status: {
        204: DeleteQuestionResponseSchema,
      },
    },
  },
};

const generatePdf: RouteConfiguration = {
  path: '/pdf-questions',
  method: 'GET',
  handler: generatePdfHandler,
  config: {
    validate: GeneratePdfRequestSchema,
    auth: { mode: 'try' },
    tags: ['api', 'questions'],
  },
};

export const questionsRoutes: RouteConfiguration[] = [
  getQuestionsRoute,
  createQuestionRoute,
  partiallyUpdateQuestion,
  deleteQuestion,
  generatePdf,
];
