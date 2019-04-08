import moment from 'moment';
import { expect } from 'chai';
import {
  getFortnightInvoicePeriod,
  getBiMonthlyInvoicePeriod,
  getInvoicePeriod,
} from '../utils/date';

describe('invoiceHelpers', () => {
  describe('getInvoicePeriod', () => {
    it('works for week 1', () => {
      const expectedResult = {
        startDate: new Date('2018-08-13T00:00:00+00:00'),
        endDate: new Date('2018-08-24T00:00:00+00:00'),
      };

      const startAt = moment.utc('2018-08-21');
      for (let i = 0; i < 14; ++i) {
        expect(getFortnightInvoicePeriod(startAt.toDate())).to.eql(expectedResult);
        startAt.add(1, 'day');
      }
    });

    it('works for week 2', () => {
      const expectedResult = {
        startDate: new Date('2018-08-27T00:00:00+00:00'),
        endDate: new Date('2018-09-07T00:00:00+00:00'),
      };

      const startAt = moment.utc('2018-09-04');
      for (let i = 0; i < 14; ++i) {
        expect(getFortnightInvoicePeriod(startAt.toDate())).to.eql(expectedResult);
        startAt.add(1, 'day');
      }
    });

    it('works for week 3', () => {
      const expectedResult = {
        startDate: new Date('2018-09-10T00:00:00+00:00'),
        endDate: new Date('2018-09-21T00:00:00+00:00'),
      };

      const startAt = moment.utc('2018-09-18');
      for (let i = 0; i < 14; ++i) {
        expect(getFortnightInvoicePeriod(startAt.toDate())).to.eql(expectedResult);
        startAt.add(1, 'day');
      }
    });

    it('works for week 4', () => {
      const expectedResult = {
        startDate: new Date('2018-09-24T00:00:00+00:00'),
        endDate: new Date('2018-10-05T00:00:00+00:00'),
      };

      const startAt = moment.utc('2018-10-02');
      for (let i = 0; i < 14; ++i) {
        expect(getFortnightInvoicePeriod(startAt.toDate())).to.eql(expectedResult);
        startAt.add(1, 'day');
      }
    });

    it('works for edge cases', () => {
      const expectedResult = {
        startDate: new Date('2018-12-17T00:00:00+00:00'),
        endDate: new Date('2018-12-28T00:00:00+00:00'),
      };

      const startAt = moment.utc('2018-12-25');
      for (let i = 0; i < 14; ++i) {
        expect(getFortnightInvoicePeriod(startAt.toDate())).to.eql(expectedResult);
        startAt.add(1, 'day');
      }
    });
  });

  describe('getBiMonthlyInvoicePeriod', () => {
    it('works for date from last day of prior month to day 14th', () => {
      const expectedResult = {
        startDate: new Date('2019-02-16T00:00:00+00:00'),
        endDate: new Date('2019-02-28T00:00:00+00:00'),
      };

      const date = moment.utc('2019-02-28');
      while (date.isSameOrBefore(moment.utc('2019-03-14'))) {
        expect(getBiMonthlyInvoicePeriod(date.toDate())).to.eql(expectedResult);
        date.add(1, 'day');
      }
    });

    it('works for date from day 15th to penultimate day of the month', () => {
      const expectedResult = {
        startDate: new Date('2019-03-01T00:00:00+00:00'),
        endDate: new Date('2019-03-15T00:00:00+00:00'),
      };

      const date = moment.utc('2019-03-15');
      while (date.isSameOrBefore(moment.utc('2019-03-30'))) {
        expect(getBiMonthlyInvoicePeriod(date.toDate())).to.eql(expectedResult);
        date.add(1, 'day');
      }
    });
  });

  describe('getCurrentInvoicePeriod', () => {
    it('works for fortnight invoice periods', () => {
      const expectedResult = {
        startDate: new Date('2018-12-17T00:00:00+00:00'),
        endDate: new Date('2018-12-28T00:00:00+00:00'),
      };

      expect(getInvoicePeriod(moment.utc('2018-12-30').toDate())).to.eql(expectedResult);
    });

    it('works for fortnight invoice periods', () => {
      const expectedResult = {
        startDate: new Date('2018-12-16T00:00:00+00:00'),
        endDate: new Date('2018-12-31T00:00:00+00:00'),
      };

      expect(getInvoicePeriod(moment.utc('2018-12-31').toDate())).to.eql(expectedResult);
    });
  });
});
