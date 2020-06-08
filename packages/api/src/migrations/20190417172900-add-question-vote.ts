import { QueryInterface, SequelizeStatic } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: SequelizeStatic) {
    return queryInterface.createTable('QuestionVote', {
      _userId: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: { model: 'User', key: 'id' },
        allowNull: false,
      },
      _questionId: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: { model: 'Question', key: 'id' },
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface: QueryInterface, _Sequelize: SequelizeStatic) {
    return queryInterface.dropTable('QuestionVote');
  },
};
