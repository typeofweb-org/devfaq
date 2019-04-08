import chai, { expect } from 'chai';
import chaiDateTime from 'chai-datetime';
import moment from 'moment';
import { Server } from 'hapi';
import * as GoogleAuthLibrary from 'google-auth-library';
import sinon from 'sinon';
import { Op } from 'sequelize';

import { getServerWithPlugins } from '../../server';
import { Session } from '../../models/Session';
import { seedTestUser } from '../../tests/integrationTestsUtils';

chai.use(chaiDateTime);

describe('authRoute', async () => {
  const GoogleAuthMock = {
    async verifyIdToken(_opts: { idToken: string }) {
      return {
        getPayload() {
          return {
            sub: 'some google id',
            hd: 'devfaq.localhost',
            email: 'test-user@devfaq.localhost',
          };
        },
      };
    },
  };
  let devfaqServer: Server;

  beforeEach(async () => {
    sinon.stub(GoogleAuthLibrary, 'OAuth2Client').returns(GoogleAuthMock);
    devfaqServer = await getServerWithPlugins();
    await seedTestUser();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('set validity to 2 hours by default', async () => {
    const now = moment();

    // given I have no valid session
    await Session.destroy({
      where: {
        id: { [Op.ne]: null },
      },
    });

    // when I log in
    await devfaqServer.inject({
      method: 'POST',
      url: '/sessions/google',
      payload: {
        idToken: 'some token from Google',
      },
    });

    const session = await Session.findOne();
    expect(session).to.be.ok;

    const actualValidity = session!.validUntil;
    const twoHours = now.add(2, 'hours');

    expect(actualValidity).to.be.withinTime(
      twoHours.toDate(),
      twoHours.add(10, 'seconds').toDate()
    );
  });

  it('set validity to a week when you want to keep being signed in', async () => {
    const now = moment();

    // given I have no valid session
    await Session.destroy({
      where: {
        id: { [Op.ne]: null },
      },
    });

    // when I log in with keep me signed in
    await devfaqServer.inject({
      method: 'POST',
      url: '/sessions/google',
      payload: {
        idToken: 'some token from Google',
        keepMeSignedIn: true,
      },
    });

    const session = await Session.findOne();
    expect(session).to.be.ok;

    const actualValidity = session!.validUntil;
    const oneWeek = now.add(7, 'days');

    expect(actualValidity).to.be.withinTime(oneWeek.toDate(), oneWeek.add(10, 'seconds').toDate());
  });

  it('should extend the session by 2 hours by default', async () => {
    const now = moment();
    let session = await Session.findOne();
    session!.validUntil = moment()
      .add({
        hours: 1,
        minutes: 30,
      })
      .toDate();

    await session!.save();

    const res = await devfaqServer.inject({
      method: 'GET',
      url: '/helloWorld',
      headers: {
        Authorization: `Bearer ${session!.id}`,
      },
    });

    session = await Session.findByPk(session!.id);

    const actualValidity = session!.validUntil;
    const twoHours = now.add({
      hours: 2,
    });

    expect(res.statusCode).to.eql(200);

    expect(actualValidity).to.be.withinTime(
      twoHours.toDate(),
      twoHours.add(10, 'seconds').toDate()
    );
  });

  it('should extend the session by one week if keep me signed in is true', async () => {
    const now = moment();
    let session = await Session.findOne();
    session!.keepMeSignedIn = true;
    session!.validUntil = moment()
      .add({
        hours: 1,
        minutes: 30,
      })
      .toDate();

    await session!.save();

    const res = await devfaqServer.inject({
      method: 'GET',
      url: '/helloWorld',
      headers: {
        Authorization: `Bearer ${session!.id}`,
      },
    });

    session = await Session.findByPk(session!.id);

    const actualValidity = session!.validUntil;
    const oneWeek = now.add({
      days: 7,
    });

    expect(res.statusCode).to.eql(200);

    expect(actualValidity).to.be.withinTime(oneWeek.toDate(), oneWeek.add(10, 'seconds').toDate());
  });
});
