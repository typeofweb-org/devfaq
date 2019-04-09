import { expect } from 'chai';
import Joi from 'typesafe-joi';
import { Server } from 'typesafe-hapi';
import { getServerWithPlugins } from '../../server';
import { GetQuestionsResponseSchema } from './questionSchemas';
import { uniqBy } from 'lodash';
import { generateQuestions } from '../../tests/integrationTestsUtils';
import { QUESTION_STATUS } from '../../models-consts';

describe('helloWorldRoute', async () => {
  let devfaqServer: Server;

  beforeEach(async () => {
    devfaqServer = await getServerWithPlugins();
  });

  it('should return questions in query', async () => {
    await generateQuestions(20);

    const res = await devfaqServer.inject({
      method: 'GET',
      url: '/questions',
    });

    const result = res.result as Joi.SchemaValue<typeof GetQuestionsResponseSchema>;
    expect(result).to.be.an('array');

    const areAllAccepted = result.every(item => item._statusId === QUESTION_STATUS.ACCEPTED);
    expect(areAllAccepted).to.eql(true);

    const areAllUnique = uniqBy(result, 'id').length === result.length;
    expect(areAllUnique).to.eql(true);
  });
});
