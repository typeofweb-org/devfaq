import { expect } from 'chai';
import { defaultToAny } from '../utils/utils';

describe('utils', () => {
  describe('defaultToAny', () => {
    it('should use first value if provided', () => {
      expect(defaultToAny(1)).to.eql(1);
    });

    it('should use second value if first is undefined', () => {
      expect(defaultToAny(undefined, 'aaa')).to.eql('aaa');
    });

    it('should use second value if first is null', () => {
      expect(defaultToAny(null, 'bbb')).to.eql('bbb');
    });

    it('should use next values if previous are undefined or null', () => {
      expect(defaultToAny(undefined, null, 123)).to.eql(123);
    });
  });
});
