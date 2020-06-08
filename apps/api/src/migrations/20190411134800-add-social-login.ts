import { QueryInterface, SequelizeStatic } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: SequelizeStatic) {
    return queryInterface.addColumn('User', 'socialLogin', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: {},
    });
  },

  async down(queryInterface: QueryInterface, _Sequelize: SequelizeStatic) {
    return queryInterface.removeColumn('User', 'socialLogin');
  },
};
