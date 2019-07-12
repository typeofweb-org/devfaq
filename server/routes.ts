import Routes, * as nextRoutes from 'next-routes';

type InternalRouteRepresentation = {
  keyNames: string[];
  keys: Array<{
    delimiter: string;
    name: string;
    optional: boolean;
    partial: boolean;
    pattern: string;
    prefix: string;
    repeat: boolean;
  }>;
  name: string;
  page: string;
  pattern: string;
  regex: RegExp;
  toPath: (data: any, options: any) => any;
};

type FindAndGetUrlsRet = {
  byName?: true;
  route?: InternalRouteRepresentation;
  urls: {
    as: string;
    href: string;
  };
};
abstract class ExtendedRoutes extends ((nextRoutes as any) as new () => Routes) {
  abstract findAndGetUrls(route: string, params?: nextRoutes.RouteParams): FindAndGetUrlsRet;
}

const routes = ((nextRoutes as any) as () => ExtendedRoutes)();

routes
  .add('index', '/')
  .add('one-question', '/questions/:id(\\d+)', 'oneQuestion')
  .add('questions', '/questions/:technology?')
  .add('selected-questions', '/selected-questions', 'selectedQuestions')
  .add('about', '/about', 'staticPage')
  .add('authors', '/authors', 'staticPage')
  .add('regulations', '/regulations', 'staticPage')
  .add('login', '/login', 'loginPage')
  .add('admin', '/admin', 'adminPage');

export default routes;

export const Link = routes.Link;
export const Router = routes.Router;
export type LinkProps = nextRoutes.LinkProps;
