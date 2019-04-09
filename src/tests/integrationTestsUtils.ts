import { initDb, sequelize, getAllModels } from '../db';
import { Question } from '../models/Question';
import faker from 'faker';
import { QUESTION_CATEGORY, QUESTION_LEVEL, QUESTION_STATUS } from '../models-consts';

before(async () => {
  await initDb();
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

  const keys = Object.keys(getAllModels()).filter(key => !TRUNCATE_BLACKLIST.includes(key));
  return Promise.all(
    keys.map(async key => {
      await sequelize.query(`TRUNCATE TABLE "${key}" RESTART IDENTITY CASCADE;`, {
        raw: true,
      });
    })
  );
}

export async function generateQuestions(num: number): Promise<Question[]> {
  return Promise.all(
    Array.from({ length: num }).map(async _i => {
      const _categoryId = faker.random.objectElement(QUESTION_CATEGORY);
      const _levelId = faker.random.objectElement(QUESTION_LEVEL);
      const _statusId = faker.random.objectElement(QUESTION_STATUS);

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
