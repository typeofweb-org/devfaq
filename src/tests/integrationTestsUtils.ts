// import { identity as defaultTransformer } from 'lodash';
// import moment from 'moment';
// import { User } from '../models/User';
// import { Bounty } from '../models/Bounty';
// import { Session } from '../models/Session';
// import { initDb, sequelize, getAllModels, RawModel } from '../db';
// import {
//   NonAbstractTypeOfModel,
//   FilteredModelAttributes,
//   Model,
//   // tslint:disable-next-line:no-submodule-imports
// } from 'sequelize-typescript/lib/models/Model';
// import { USER_TYPE } from '../models-consts';

// before(async () => {
//   await initDb();
//   await sequelize.sync({ match: /_test$/, logging: false });
//   await clearDB();
// });

// afterEach(async () => {
//   await clearDB();
// });

// async function clearDB() {
//   const TRUNCATE_BLACKLIST = ['sequelize', 'Sequelize'];

//   const keys = Object.keys(getAllModels()).filter(
//     (key) => !TRUNCATE_BLACKLIST.includes(key)
//   );
//   return Promise.all(
//     keys.map(async (key) => {
//       await sequelize.query(
//         `TRUNCATE TABLE "${key}" RESTART IDENTITY CASCADE;`,
//         {
//           raw: true,
//         }
//       );
//     })
//   );
// }

// const testUserData = {
//   email: 'test-user@devfaq.localhost',
//   displayName: 'Test User',
//   isActive: true,
//   slackId: 'U2147483697',
//   avatarUrl: 'http://some.url.localhost/avatar.jpg',
//   _roleId: 1,
//   _typeId: USER_TYPE.DEVELOPER,
//   _currencyId: 1,
// };

// export async function seedTestUser(options = {}) {
//   const user = await User.create({
//     ...testUserData,
//     ...options,
//   });

//   const session = await Session.create({
//     validUntil: moment()
//       .add('2', 'hours')
//       .toDate(),
//     _userId: user.id,
//   });

//   return {
//     user,
//     session,
//   };
// }

// export async function seedTestAdminUser(options = {}) {
//   return seedTestUser({
//     email: 'test-admin@devfaq.localhost',
//     displayName: 'Test Admin',
//     _roleId: 3,
//     ...options,
//   });
// }
