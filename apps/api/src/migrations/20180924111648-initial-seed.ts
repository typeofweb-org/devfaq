import { QueryInterface, SequelizeStatic } from 'sequelize';

enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
}

enum QUESTION_CATEGORY {
  HTML = 'html',
  CSS = 'css',
  JS = 'js',
  ANGULAR = 'angular',
  REACT = 'react',
  GIT = 'git',
  OTHER = 'other',
}

enum QUESTION_LEVEL {
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
}

enum QUESTION_STATUS {
  ACCEPTED = 'accepted',
  PENDING = 'pending',
}

// tslint:disable-next-line:no-any
function toEntities(enumerable: any): Array<{ id: string }> {
  return Object.values<string>(enumerable).map((t) => ({
    id: t,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

module.exports = {
  async up(queryInterface: QueryInterface, _Sequelize: SequelizeStatic) {
    const userRoles = toEntities(USER_ROLE);
    const questionCategories = toEntities(QUESTION_CATEGORY);
    const questionLevels = toEntities(QUESTION_LEVEL);
    const questionStatuses = toEntities(QUESTION_STATUS);

    return Promise.all([
      queryInterface.bulkInsert('UserRoleType', userRoles),
      queryInterface.bulkInsert('QuestionCategory', questionCategories),
      queryInterface.bulkInsert('QuestionLevel', questionLevels),
      queryInterface.bulkInsert('QuestionStatus', questionStatuses),
    ]);
  },

  async down(queryInterface: QueryInterface, _Sequelize: SequelizeStatic) {
    const userRoles = toEntities(USER_ROLE);
    const questionCategories = toEntities(QUESTION_CATEGORY);
    const questionLevels = toEntities(QUESTION_LEVEL);
    const questionStatuses = toEntities(QUESTION_STATUS);

    return Promise.all([
      queryInterface.bulkDelete('UserRoleType', userRoles),
      queryInterface.bulkDelete('QuestionCategory', questionCategories),
      queryInterface.bulkDelete('QuestionLevel', questionLevels),
      queryInterface.bulkDelete('QuestionStatus', questionStatuses),
    ]);
  },
};
