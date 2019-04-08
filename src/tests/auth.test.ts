import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiDateTime from 'chai-datetime';
import moment from 'moment';

import { Session } from '../models/Session';
import { maybeUpdateSessionValidity } from '../plugins/auth/auth';

chai.use(chaiDateTime);

describe('maybeUpdateSessionValidity', () => {
  it('should not update validUntil if less than 1 minuted passed since the last update', async () => {
    const sessionStub = {
      save: sinon.stub(),
      validUntil: moment()
        .add(2, 'hours')
        .toDate(),
      keepMeSignedIn: false,
    };

    await maybeUpdateSessionValidity((sessionStub as unknown) as Session);

    expect(sessionStub.save).to.have.callCount(0);
  });

  it('should update validUntil if more than 1 minuted passed since the last update', async () => {
    const sessionStub = {
      save: sinon.stub(),
      validUntil: moment()
        .add({
          hours: 1,
          minutes: 58,
        })
        .toDate(),
      keepMeSignedIn: false,
    };

    await maybeUpdateSessionValidity((sessionStub as unknown) as Session);

    expect(sessionStub.save).to.have.callCount(1);
  });

  it('should update validUntil to 2 hours if keep me signed in is false', async () => {
    const now = moment();
    const validUntil = moment().add({
      hours: 1,
      minutes: 30,
    });

    const sessionStub = {
      save: sinon.stub(),
      validUntil: validUntil.toDate(),
      keepMeSignedIn: false,
    };

    await maybeUpdateSessionValidity((sessionStub as unknown) as Session);

    const actualValidity = sessionStub!.validUntil;
    const twoHours = now.add({
      hours: 2,
    });

    expect(sessionStub.save).to.have.callCount(1);

    expect(actualValidity).to.be.withinTime(
      twoHours.toDate(),
      twoHours.add(10, 'seconds').toDate()
    );
  });

  it('should update validUntil to 7 days if keep me signed in is true', async () => {
    const now = moment();
    const validUntil = moment().add({
      days: 3,
      minutes: 30,
    });

    const sessionStub = {
      save: sinon.stub(),
      validUntil: validUntil.toDate(),
      keepMeSignedIn: true,
    };

    await maybeUpdateSessionValidity((sessionStub as unknown) as Session);

    const actualValidity = sessionStub!.validUntil;
    const twoHours = now.add({
      days: 7,
    });

    expect(sessionStub.save).to.have.callCount(1);

    expect(actualValidity).to.be.withinTime(
      twoHours.toDate(),
      twoHours.add(10, 'seconds').toDate()
    );
  });
});
