// tslint:disable:no-implicit-dependencies
import {
  hrefQueryToAsPath,
  getPreviousPathFromHrefQuery,
  getHrefQueryFromPreviousPath,
} from './redirect';
import fc from 'fast-check';
import * as Arbitraries from '../fast-check-arbitraries';

describe('hrefQueryToAsPath', () => {
  describe('unit test', () => {
    it(`returns the same url when there are no replacements`, () => {
      expect(hrefQueryToAsPath('/questions/javascript')).toEqual({
        href: '/questions/javascript',
        as: '/questions/javascript',
      });
    });

    it(`replaces segments in href`, () => {
      expect(hrefQueryToAsPath('/questions/p/[id]', { id: '123' })).toEqual({
        href: '/questions/p/[id]',
        as: '/questions/p/123',
      });
    });

    it(`adds additional query params as a query`, () => {
      expect(
        hrefQueryToAsPath('/questions/[technology]', {
          technology: 'css',
          page: '1',
          orderBy: 'common',
        })
      ).toEqual({
        href: '/questions/[technology]?page=1&orderBy=common',
        as: '/questions/css?page=1&orderBy=common',
      });
    });
  });

  describe('property tests', () => {
    it(`returns the same url when there are no replacements`, () => {
      fc.assert(
        fc.property(Arbitraries.path(), path => {
          const result = hrefQueryToAsPath(path);
          return result.as === result.href && result.as === path;
        })
      );
    });

    it(`replaces segments in href`, () => {
      fc.assert(
        fc.property(Arbitraries.routeWithReplacements(), ({ data, expected }) => {
          const result = hrefQueryToAsPath(data.href, data.query);
          return result.as === expected.as && result.href === expected.href;
        })
      );
    });

    it(`adds additional query params as a query`, () => {
      fc.assert(
        fc.property(Arbitraries.routeWithReplacements(true), ({ data, expected }) => {
          const result = hrefQueryToAsPath(data.href, data.query);
          return result.as === expected.as && result.href === expected.href;
        })
      );
    });
  });
});

describe('getPreviousPathFromHrefQuery+getHrefQueryFromPreviousPath', () => {
  describe('unit tests', () => {
    it('should return null for empty string', () => {
      expect(getHrefQueryFromPreviousPath('')).toEqual(null);
    });

    it('should return null for nil', () => {
      expect(getHrefQueryFromPreviousPath(null)).toEqual(null);
      expect(getHrefQueryFromPreviousPath(undefined)).toEqual(null);
    });

    it('should return null for invalid JSON', () => {
      expect(getHrefQueryFromPreviousPath('{dddd}')).toEqual(null);
    });

    it('should return null for JSON without href or query', () => {
      expect(getHrefQueryFromPreviousPath(JSON.stringify({}))).toEqual(null);
    });
  });

  describe('property tests', () => {
    it('getPreviousPathFromHrefQuery includes href and query', () => {
      fc.assert(
        fc.property(Arbitraries.routeWithReplacements(true), ({ data }) => {
          expect(getPreviousPathFromHrefQuery(data.href, data.query)).toMatch(data.href);
          expect(getPreviousPathFromHrefQuery(data.href, data.query)).toMatch(
            JSON.stringify(data.query)
          );
        })
      );
    });

    it('getPreviousPathFromHrefQuery(getHrefQueryFromPreviousPath())', () => {
      fc.assert(
        fc.property(Arbitraries.routeWithReplacements(true), ({ data }) => {
          const json = JSON.stringify({ href: data.href, query: data.query });
          const result1 = getHrefQueryFromPreviousPath(json);
          expect(getPreviousPathFromHrefQuery(result1.href, result1.query)).toEqual(json);
        })
      );
    });

    it('getHrefQueryFromPreviousPath(getPreviousPathFromHrefQuery())', () => {
      fc.assert(
        fc.property(Arbitraries.routeWithReplacements(true), ({ data }) => {
          expect(
            getHrefQueryFromPreviousPath(getPreviousPathFromHrefQuery(data.href, data.query))
          ).toEqual({ href: data.href, query: data.query });
        })
      );
    });
  });
});
