import { User } from '../../models/User';
import { Session } from '../../models/Session';
import { Op } from 'sequelize';
import { getNewSessionValidUntil } from '../../utils/utils';

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

  await user.update('lastLoginAt', new Date());

  await session.reload({
    include: [
      {
        model: User.scope('defaultScope', 'withSensitiveData'),
      },
    ],
  });

  return session.toJSON();
}
