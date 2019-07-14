import fc from 'fast-check';
import { pipe, identity, entries } from 'lodash/fp';

type EntriesOf<T extends object> = T extends Record<string, infer R> ? Array<[string, R]> : never;

type GetArbitraryType<T> = T extends fc.Arbitrary<infer R> ? R : never;
type SegmentsDict = GetArbitraryType<ReturnType<typeof segmentsRecordWithReplacements>>;
type Routes = ReturnType<typeof segmentsDictEntriesToRoutes>;
type MergedRoute = ReturnType<typeof routesToMergedRoute>;

export const path = () => {
  return fc.array(fc.webSegment()).map(arr => '/' + arr.join('/'));
};

export const routeWithReplacements = (excessReplacements = false) => {
  return segmentsRecordWithReplacements(excessReplacements).map(
    pipe(
      entries,
      segmentsDictEntriesToRoutes,
      routesToMergedRoute,
      routeToResult
    )
  );
};

const segmentsRecordWithReplacements = (excessReplacements = false) => {
  return fc.dictionary(
    fc.webSegment().filter(identity),
    fc.record({
      replacement: excessReplacements
        ? fc.oneof<false | string>(fc.constant(false as const), fc.webSegment().filter(identity))
        : fc.constant(false as const),
      isExcess: fc.boolean(),
    })
  );
};

const segmentsDictEntriesToRoutes = (entries: EntriesOf<SegmentsDict>) =>
  entries.map(([segment, { replacement, isExcess }]) => {
    const query = replacement === false ? segment : replacement;

    if (isExcess) {
      return { key: segment, query, replacement: null, href: null };
    } else if (replacement === false) {
      return { key: segment, query: null, replacement: null, href: segment };
    } else {
      return { key: segment, query: null, replacement, href: '[' + segment + ']' };
    }
  });

const routesToMergedRoute = (routes: Routes) => {
  return routes.reduce(
    (acc, { key, query, replacement, href }) => {
      const asPath = !href ? '' : '/' + (replacement ? replacement : href);
      return {
        ...acc,
        query: { ...acc.query, ...(query && { [key]: query }) },
        href: acc.href + (href ? '/' + href : ''),
        replacements: { ...acc.replacements, ...(replacement && { [key]: replacement }) },
        asPath: acc.asPath + asPath,
      };
    },
    { href: '/', asPath: '/', query: {}, replacements: {} }
  );
};

const routeToResult = (mergedRoute: MergedRoute) => {
  const queryString = Object.entries(mergedRoute.query)
    .map(([key, val]) => `${key}=${val}`)
    .join('&');

  return {
    data: {
      href: mergedRoute.href,
      query: { ...mergedRoute.replacements, ...mergedRoute.query },
    },
    expected: {
      href: mergedRoute.href + (queryString ? '?' + queryString : ''),
      as: mergedRoute.asPath + (queryString ? '?' + queryString : ''),
    },
  };
};
