import { Server } from 'typesafe-hapi';

export const healthCheckRoute = {
  init(server: Server) {
    return server.route({
      method: 'GET',
      path: '/health-check',
      options: {
        description: 'Health check endpoint',
        tags: ['api'],
      },
      handler() {
        return null;
      },
    });
  },
};
