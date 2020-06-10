import faker from 'faker';

import { initLegacyDb, sequelize, getAllModels } from '../lagacy_db';
import { questionCategories, questionLevels, questionStatuses } from '../models-consts';
import { Question } from '../models/Question';

before(async () => {
  await initLegacyDb();
  await sequelize.sync({ match: /_test$/, logging: false });
  await clearDB();
});

afterEach(async () => {
  await clearDB();
});

async function clearDB() {
  const TRUNCATE_BLACKLIST = [
    'sequelize',
    'Sequelize',
    'SequelizeMeta',
    'QuestionCategory',
    'QuestionLevel',
    'QuestionStatus',
    'UserRole',
  ];

  const keys = Object.keys(getAllModels()).filter((key) => !TRUNCATE_BLACKLIST.includes(key));
  return Promise.all(
    keys.map(async (key) => {
      await sequelize.query(`TRUNCATE TABLE "${key}" RESTART IDENTITY CASCADE;`, {
        raw: true,
      });
    })
  );
}

export async function generateQuestions(num: number): Promise<Question[]> {
  return Promise.all(
    Array.from({ length: num }).map(async (_i) => {
      const _categoryId = faker.random.arrayElement(questionCategories);
      const _levelId = faker.random.arrayElement(questionLevels);
      const _statusId = faker.random.arrayElement(questionStatuses);

      return Question.create({
        question: faker.lorem.sentence(),
        acceptedAt: faker.date.past(),
        _categoryId,
        _levelId,
        _statusId,
      });
    })
  );
}
