import Hapi from 'hapi';

export const healthCheckRoutes: Hapi.ServerRoute[] = [
  {
    method: 'GET',
    path: '/health-check',
    options: {
      auth: false,
      description: 'Health check endpoint',
      tags: ['api'],
    },
    handler() {
      return null;
    },
  },
];
