import { ServerResponse } from 'http';

import { NextPageContext } from 'next';
import { LinkProps } from 'next/link';
import Router from 'next/router';

import type { RouteDetails } from './types';

export type Query = RouteDetails['query'] & { previousPath?: string };

export function getPreviousPathFromHrefQuery(href: string, query: Query = {}) {
  return JSON.stringify({ href, query });
}

export function getHrefQueryFromPreviousPath(
  previousPath?: string | string[]
): null | { href: string; query: Query } {
  if (!previousPath) {
    return null;
  }

  if (Array.isArray(previousPath)) {
    return null;
  }
  try {
    const result: unknown = JSON.parse(previousPath);
    if (typeof result === 'object' && result && 'href' in result && 'query' in result) {
      return result as any;
    }
  } catch (err) {
    // console.error(err);
  }
  return null;
}

export function redirect(href: string, query: Query = {}, ctx?: NextPageContext) {
  const result = hrefQueryToAsPath(href, query);

  if (ctx?.res) {
    ctx.res.writeHead(302, { Location: result.as });
    ctx.res.end();
  } else {
    Router.push(result.href, result.as);
  }
  return {};
}

/**
 * .matchAll polyfill for poor ;)
 */
const allMatches = (str: string, regex: RegExp): RegExpExecArray[] => {
  let x: RegExpExecArray | null;
  const result: RegExpExecArray[] = [];
  while ((x = regex.exec(str))) {
    result.push(x);
  }
  return result;
};

export function hrefQueryToAsPath(
  url: LinkProps['href'],
  query: Record<string, string[] | string | undefined> = {},
  skipExcessQueryProps = false
) {
  const href = String(url);

  // matches anything like [bla-bla]
  const replacementsPattern = /\[([^[\]\s]+)\]/gi;

  const matches = allMatches(href, replacementsPattern);
  const excessQueryProperties = Object.keys(query).filter(
    (key) => !matches.find(([, replacement]) => key === replacement)
  );

  const maybeQueryString = skipExcessQueryProps
    ? ''
    : excessQueryProperties.map((prop) => `${prop}=${query[prop]}`).join('&');
  const queryString = maybeQueryString ? '?' + maybeQueryString : '';

  return {
    as:
      href.replace(replacementsPattern, (_, replacement: string) => String(query[replacement])) +
      queryString,
    href: href + queryString,
  };
}
