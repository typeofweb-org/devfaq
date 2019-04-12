import { expect } from 'chai';
import Joi from 'joi';
import { Server } from 'hapi';
import { getServerWithPlugins } from '../../server';
import { GetQuestionsResponseSchema, CreateQuestionRequestPayloadSchema } from './questionSchemas';
import { uniqBy } from 'lodash';
import { generateQuestions } from '../../tests/integrationTestsUtils';
import { QUESTION_STATUS, QUESTION_CATEGORY, QUESTION_LEVEL } from '../../models-consts';
import faker = require('faker');
import { Question } from '../../models/Question';

describe('helloWorldRoute', async () => {
  let devfaqServer: Server;

  beforeEach(async () => {
    devfaqServer = await getServerWithPlugins();
  });

  it('should allow empty response', async () => {
    const res = await devfaqServer.inject({
      method: 'GET',
      url: '/questions',
    });

    expect(res.result).to.eql([]);
  });

  const assertAreAllAccepted = <T extends Array<any>>(result: T) => {
    const areAllAccepted = result.every(
      item => item._statusId === QUESTION_STATUS.ACCEPTED && item.acceptedAt
    );
    expect(areAllAccepted).to.eql(true);
  };

  const assertAreAllPending = <T extends Array<any>>(result: T) => {
    const areAllPending = result.every(
      item => item._statusId === QUESTION_STATUS.PENDING && !item.acceptedAt
    );
    expect(areAllPending).to.eql(true);
  };

  const assertAreAllUnique = <T extends Array<any>>(result: T) => {
    const areAllUnique = uniqBy(result, 'id').length === result.length;
    expect(areAllUnique).to.eql(true);
  };

  const assertAllHaveValidCategory = <T extends Array<any>>(category: any, result: T) => {
    const allHaveValidCategory = result.every(item => item._categoryId === category);
    expect(allHaveValidCategory, category).to.eql(true);
  };

  const assertAllHaveValidLevel = <T extends Array<any>>(level: any, result: T) => {
    const allHaveValidLevel = result.every(item => item._levelId === level);
    expect(allHaveValidLevel, level).to.eql(true);
  };

  describe('GET /questions', async () => {
    it('should return all questions in query', async () => {
      await generateQuestions(20);

      const res = await devfaqServer.inject({
        method: 'GET',
        url: '/questions',
      });

      const result = res.result as Joi.SchemaValue<typeof GetQuestionsResponseSchema>;
      expect(result).to.be.an('array');

      assertAreAllAccepted(result!.data);
      assertAreAllUnique(result!.data);
    });

    it('should return questions matching the query', async () => {
      await generateQuestions(20);

      for (let i = 0; i < 5; ++i) {
        const category = faker.random.objectElement(QUESTION_CATEGORY) as QUESTION_CATEGORY;
        const level = faker.random.objectElement(QUESTION_LEVEL) as QUESTION_LEVEL;

        const res = await devfaqServer.inject({
          method: 'GET',
          url: `/questions?category=${category}&level=${level}`,
        });
        const result = res.result as Joi.SchemaValue<typeof GetQuestionsResponseSchema>;

        assertAllHaveValidCategory(category, result!.data);
        assertAllHaveValidLevel(level, result!.data);
        assertAreAllAccepted(result!.data);
        assertAreAllUnique(result!.data);
      }
    });
  });

  describe('POST /questions', async () => {
    it('should create questions with status=pending', async () => {
      for (let i = 0; i < 20; ++i) {
        const category = faker.random.objectElement(QUESTION_CATEGORY) as QUESTION_CATEGORY;
        const level = faker.random.objectElement(QUESTION_LEVEL) as QUESTION_LEVEL;

        const payload: Joi.SchemaValue<typeof CreateQuestionRequestPayloadSchema> = {
          question: faker.lorem.sentence(),
          category,
          level,
        };

        await devfaqServer.inject({
          method: 'POST',
          url: `/questions`,
          payload,
        });
      }

      const questions = await Question.findAll({ raw: true });
      assertAreAllPending(questions);
      assertAreAllUnique(questions);
    });
  });
});
