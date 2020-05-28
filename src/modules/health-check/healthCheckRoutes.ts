import { Server } from '@hapi/hapi';

export const healthCheckRoute = {
  init(server: Server) {
    return server.route({
      method: 'GET',
      path: '/health-check',
      options: {
        description: 'Health check endpoint',
        tags: ['api'],
        auth: false,
      },
      handler() {
        return null;
      },
    });
  },
};
