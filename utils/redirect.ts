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

/**
 * .matchAll polyfill for poor ;)
 */
const allMatches = (str: string, regex: RegExp): RegExpExecArray[] => {
  let x: RegExpExecArray | null;
  const result: RegExpExecArray[] = [];
  // tslint:disable-next-line:no-conditional-assignment
  while ((x = regex.exec(str))) {
    result.push(x);
  }
  return result;
};

export function hrefQueryToAsPath(href: string, query: Record<string, string> = {}) {
  // matches anything like [bla-bla]
  const replacementsPattern = /\[([^\[\]\s]+)\]/gi;

  const matches = allMatches(href, replacementsPattern);
  const excessQueryProperties = Object.keys(query).filter(
    key => !matches.find(([, replacement]) => key === replacement)
  );

  const queryString = excessQueryProperties.map(prop => `${prop}=${query[prop]}`).join('&');

  return (
    href.replace(replacementsPattern, (_, replacement: string) => query[replacement]) +
    (queryString ? '?' + queryString : '')
  );
}

export function redirect2(href: string, query: object = {}, ctx: NextPageContext) {
  //
}
