import Hapi from 'hapi';
import { sessionWithUserSchema } from './sessionValidation';

export const meSessionRoutes: Hapi.ServerRoute[] = [
  {
    method: 'GET',
    path: '/me',
    options: {
      auth: {
        mode: 'required',
      },
      description: 'Get current session info',
      tags: ['api', 'auth'],
      response: {
        schema: sessionWithUserSchema,
      },
    },
    handler(request, _h) {
      return request.auth.credentials.session.toJSON();
    },
  },
  {
    method: 'DELETE',
    path: '/me',
    options: {
      auth: {
        mode: 'required',
      },
      description: 'Log out',
      tags: ['api', 'auth'],
      response: {
        emptyStatusCode: 204,
      },
    },
    async handler(request, _h) {
      await request.auth.credentials.session.destroy();
      return null;
    },
  },
];
