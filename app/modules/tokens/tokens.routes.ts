import { RouteConfiguration } from 'hapi';
import { createTokenHandler, validateTokenHandler } from './tokens.handler';
import {
  CreateTokenRequestSchema,
  CreateTokenResponseSchema,
  ValidateTokenResponseSchema,
} from './tokens.schema';

const createTokenRoute: RouteConfiguration = {
  path: '/tokens',
  method: 'POST',
  handler: createTokenHandler,
  config: {
    auth: false,
    tags: ['api', 'tokens'],
    validate: CreateTokenRequestSchema,
    description: 'Creates new token for the user',
    notes: 'Effectively logs user in',
    response: {
      schema: CreateTokenResponseSchema,
    },
  },
};

const validateTokenRoute: RouteConfiguration = {
  path: '/tokens/me',
  method: 'GET',
  handler: validateTokenHandler,
  config: {
    auth: { mode: 'optional' },
    tags: ['api', 'tokens'],
    validate: {},
    description: 'Validated token and returns user',
    response: {
      schema: ValidateTokenResponseSchema,
    },
  },
};

export const authRoutes: RouteConfiguration[] = [
  createTokenRoute,
  validateTokenRoute,
];
