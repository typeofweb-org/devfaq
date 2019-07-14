// tslint:disable:no-implicit-dependencies
import { hrefQueryToAsPath } from './redirect';
import fc from 'fast-check';
import * as Arbitraries from '../fast-check-arbitraries';

describe('hrefQueryToAsPath', () => {
  describe('unit test', () => {
    it(`returns the same url when there are no replacements`, () => {
      expect(hrefQueryToAsPath('/questions/javascript')).toBe('/questions/javascript');
    });

    it(`replaces segments in href`, () => {
      expect(hrefQueryToAsPath('/questions/[id]', { id: '123' })).toBe('/questions/123');
    });

    it(`adds additional query params as a query`, () => {
      expect(
        hrefQueryToAsPath('/questions/[technology]', {
          technology: 'css',
          page: '1',
          orderBy: 'common',
        })
      ).toBe('/questions/css?page=1&orderBy=common');
    });
  });

  describe('property tests', () => {
    it(`returns the same url when there are no replacements`, () => {
      fc.assert(fc.property(Arbitraries.path(), path => hrefQueryToAsPath(path) === path));
    });

    it(`replaces segments in href`, () => {
      fc.assert(
        fc.property(
          Arbitraries.routeWithReplacements(),
          ({ href, asPath, query }) => hrefQueryToAsPath(href, query) === asPath
        )
      );
    });

    it(`adds additional query params as a query`, () => {
      fc.assert(
        fc.property(
          Arbitraries.routeWithReplacements(true),
          ({ href, asPath, query }) => hrefQueryToAsPath(href, query) === asPath
        )
      );
    });
  });
});
