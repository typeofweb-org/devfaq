import { QueryInterface, SequelizeStatic } from 'sequelize';

// tslint:disable-next-line:no-var-requires
const data = require('./out.json').map(
  // tslint:disable-next-line:no-any
  (item: any) => {
    return {
      question: item.question,
      acceptedAt: item.acceptedAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      _categoryId: item._categoryId,
      _levelId: item._levelId,
      _statusId: item._statusId,
      version: item.version,
    };
  }
);

module.exports = {
  async up(queryInterface: QueryInterface, _Sequelize: SequelizeStatic) {
    return queryInterface.sequelize.transaction(async _t => {
      await queryInterface.bulkInsert('Question', data);
    });
  },

  async down(_queryInterface: QueryInterface, _Sequelize: SequelizeStatic) {
    //
  },
};
