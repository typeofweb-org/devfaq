import { RouteConfiguration } from 'hapi';
import { createTokenHandler } from './tokens.handler';
import { CreateTokenRequestSchema, CreateTokenResponseSchema } from './tokens.schema';

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

export const authRoutes: RouteConfiguration[] = [
  createTokenRoute,
];
