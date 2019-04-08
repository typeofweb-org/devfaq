import { helloWorldRoute } from './modules/hello-world/helloWorldRoute';
import { healthCheckRoutes } from './modules/health-check/healthCheckRoutes';

export const routes = [
  helloWorldRoute,
  ...healthCheckRoutes,
];
