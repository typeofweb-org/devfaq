import { QueryInterface, SequelizeStatic } from 'sequelize';

enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
}

// tslint:disable-next-line:no-any
function toEntities(enumerable: any): Array<{ name: string }> {
  return Object.values<string>(enumerable).map(t => ({ name: t }));
}

module.exports = {
  async up(queryInterface: QueryInterface, _Sequelize: SequelizeStatic) {
    const userRoles = toEntities(USER_ROLE);

    return Promise.all([
      queryInterface.bulkInsert('UserRole', userRoles),
    ]);
  },

  async down(queryInterface: QueryInterface, _Sequelize: SequelizeStatic) {
    const userRoles = toEntities(USER_ROLE);

    return Promise.all([
      queryInterface.bulkDelete('UserRole', userRoles),
    ]);
  },
};
