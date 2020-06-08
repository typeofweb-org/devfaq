import { QueryInterface, SequelizeStatic } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: SequelizeStatic) {
    return queryInterface.createTable('Session', {
      id: { primaryKey: true, type: Sequelize.STRING, allowNull: false, unique: true },
      keepMeSignedIn: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      validUntil: { type: Sequelize.DATE, allowNull: false },
      _userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      version: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });
  },

  async down(queryInterface: QueryInterface, _Sequelize: SequelizeStatic) {
    return queryInterface.dropTable('Session');
  },
};
