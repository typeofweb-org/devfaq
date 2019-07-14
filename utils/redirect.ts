import { NextPageContext } from 'next';
import Router from 'next/router';
import { LinkProps } from 'next/link';

export function redirect(
  href: string,
  query: { previousPath?: string } & Record<string, string>,
  ctx: NextPageContext
) {
  const asPath = hrefQueryToAsPath(href, query);
  console.log({ href, query, asPath });

  if (ctx.res) {
    ctx.res.writeHead(302, { Location: asPath });
    return ctx.res.end();
  } else {
    return Router.replace(asPath);
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

export function hrefQueryToAsPath(
  url: LinkProps['href'],
  query: Record<string, string[] | string> = {}
) {
  const href = String(url);

  // matches anything like [bla-bla]
  const replacementsPattern = /\[([^\[\]\s]+)\]/gi;

  const matches = allMatches(href, replacementsPattern);
  const excessQueryProperties = Object.keys(query).filter(
    key => !matches.find(([, replacement]) => key === replacement)
  );

  const queryString = excessQueryProperties.map(prop => `${prop}=${query[prop]}`).join('&');

  return (
    href.replace(replacementsPattern, (_, replacement: string) => String(query[replacement])) +
    (queryString ? '?' + queryString : '')
  );
}
