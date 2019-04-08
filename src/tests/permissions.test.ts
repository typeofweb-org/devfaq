import { isScopeJustAUser } from '../utils/permissions';
import { expect } from 'chai';

describe('permissions', () => {
  describe('isScopeJustAUser', () => {
    it('should return false for admin', () => {
      expect(isScopeJustAUser(['admin'])).to.eql(false);
      expect(isScopeJustAUser(['user', 'admin', 'user-5'])).to.eql(false);
    });

    it('should return true for user', () => {
      expect(isScopeJustAUser(['user'])).to.eql(true);
      expect(isScopeJustAUser(['user', 'user-5'])).to.eql(true);
    });
  });
});
