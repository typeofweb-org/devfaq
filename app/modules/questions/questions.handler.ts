import * as Boom from 'boom';
import * as Hapi from 'hapi';
import { Container } from 'typedi';
import { QuestionCategory, QuestionStatus } from '../../entity/question/Question.model';
import { QuestionService } from '../../entity/question/Question.service';
import { AuthInfo } from '../../plugins/auth';
import {
  CreateQuestionRequestPayload,
  GetQuestionsRequestQuery
} from '../../validation-schema-types/types';

interface GetQuestionsRequest extends Hapi.Request {
  query: GetQuestionsRequestQuery;
}

export const getQuestionsHandler: Hapi.RouteHandler = async (_req: GetQuestionsRequest, reply) => {
  return reply(Boom.notImplemented());
};

interface CreateQuestionRequest extends Hapi.Request {
  payload: CreateQuestionRequestPayload;
}

export const createQuestionHandler: Hapi.RouteHandler = async (req: CreateQuestionRequest, reply) => {
  const questionService = Container.get(QuestionService);

  const { question, level, category } = req.payload;

  const user = req.auth.isAuthenticated ? req.auth.credentials as AuthInfo : null;
  const status: QuestionStatus = (user && user.role === 'admin') ? QuestionStatus.accepted : QuestionStatus.pending;

  const sameQuestionCount = await questionService.countByQuestion(question);
  if (sameQuestionCount > 0) {
    reply(Boom.conflict('This question exists'));
    return;
  }

  const addedQuestion = await questionService.addNew({
    question,
    level,
    category: category as QuestionCategory,
    status
  });
  reply(addedQuestion);
};
