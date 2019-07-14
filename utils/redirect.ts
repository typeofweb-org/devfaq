import { NextPageContext } from 'next';
import Router from 'next/router';
import { LinkProps } from 'next/link';

export function redirect(
  href: string,
  query: { previousPath?: string } & Record<string, string>,
  ctx?: NextPageContext
) {
  const result = hrefQueryToAsPath(href, query);

  if (ctx && ctx.res) {
    ctx.res.writeHead(302, { Location: result.as });
    return ctx.res.end();
  } else {
    return Router.replace(result.as);
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
  query: Record<string, string[] | string> = {},
  skipExcessQueryProps = false
) {
  const href = String(url);

  // matches anything like [bla-bla]
  const replacementsPattern = /\[([^\[\]\s]+)\]/gi;

  const matches = allMatches(href, replacementsPattern);
  const excessQueryProperties = Object.keys(query).filter(
    key => !matches.find(([, replacement]) => key === replacement)
  );

  const maybeQueryString = skipExcessQueryProps
    ? ''
    : excessQueryProperties.map(prop => `${prop}=${query[prop]}`).join('&');
  const queryString = maybeQueryString ? '?' + maybeQueryString : '';

  return {
    as:
      href.replace(replacementsPattern, (_, replacement: string) => String(query[replacement])) +
      queryString,
    href: href + queryString,
  };
}
