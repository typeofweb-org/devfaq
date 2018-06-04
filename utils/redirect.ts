import { Router } from '../server/routes';
import { GetInitialPropsContext } from './types';

export function redirect(ctx: GetInitialPropsContext, path: string) {
  if (ctx.isServer) {
    ctx.res.writeHead(302, { Location: path });
    ctx.res.end();
  } else {
    Router.replaceRoute(path);
  }
}
