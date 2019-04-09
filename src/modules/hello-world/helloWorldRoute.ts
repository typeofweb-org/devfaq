import { Server } from 'typesafe-hapi';

export const helloWorldRoute = {
  init(server: Server) {
    return server.route({
      method: 'GET',
      path: '/helloWorld',
      options: {
        description: 'Test endpoint',
        tags: ['api'],
      },
      handler() {
        return 'Hello, world!';
      },
    });
  },
};
