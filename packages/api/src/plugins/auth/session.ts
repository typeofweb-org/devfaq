import { Session } from '../../models/Session';
import { User } from '../../models/User';
import { Op } from 'sequelize';

export function getNewSessionValidUntil(keepMeSignedIn: boolean): Date {
  const validUntil = new Date();
  if (keepMeSignedIn) {
    // tslint:disable-next-line:no-magic-numbers
    validUntil.setHours(validUntil.getHours() + 24 * 7);
  } else {
    // tslint:disable-next-line:no-magic-numbers
    validUntil.setHours(validUntil.getHours() + 2);
  }

  return validUntil;
}

export async function createNewSession(user: User, keepMeSignedIn = false) {
  await Session.destroy({
    where: {
      validUntil: {
        [Op.lt]: new Date(),
      },
    },
  });

  const session = await Session.create({
    validUntil: getNewSessionValidUntil(keepMeSignedIn),
    keepMeSignedIn,
    _userId: user.id,
  });

  // @todo
  // await user.update('lastLoginAt', new Date());

  return session.reload({
    include: [{ model: User }],
  });
}
