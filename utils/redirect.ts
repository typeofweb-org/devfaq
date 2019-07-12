import { NextPageContext } from 'next';
import Router from 'next/router';

export function redirect(ctx: NextPageContext, path: string, previousPath?: string) {
  if (ctx.res) {
    ctx.res.writeHead(302, {
      Location: previousPath ? path + `?previousPath=${previousPath}` : path,
    });
    return ctx.res.end();
  } else {
    const url = new URL(path, location.href);
    if (previousPath) {
      url.searchParams.append('previousPath', previousPath);
    }
    return Router.replace(url);
  }
}
