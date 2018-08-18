import { Router } from '../server/routes';
import { GetInitialPropsContext } from './types';

export function redirect(ctx: GetInitialPropsContext, path: string) {
  if (ctx.isServer) {
    ctx.res.writeHead(302, { Location: path });
    return ctx.res.end();
  } else {
    return Router.replaceRoute(path);
  }
}
