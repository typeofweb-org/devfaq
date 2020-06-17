import { Server } from '@hapi/hapi';

import { getConfig } from '../../config';

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
        return {
          ENV: getConfig('ENV'),
          SENTRY_VERSION: getConfig('SENTRY_VERSION'),
        };
      },
    });
  },
};
