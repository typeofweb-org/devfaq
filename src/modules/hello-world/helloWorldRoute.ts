import Hapi from 'hapi';
import { helloWorldHandler } from './helloWorldHandler';

// @todo delete this route later
export const helloWorldRoute: Hapi.ServerRoute = {
  method: 'GET',
  path: '/helloWorld',
  options: {
    // auth: false,
    description: 'Test endpoint',
    tags: ['api'],
  },
  handler: helloWorldHandler,
};
