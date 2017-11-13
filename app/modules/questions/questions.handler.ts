import * as Boom from 'boom';
import { RequestAuthenticationInformation } from 'hapi';
import * as Hapi from 'hapi';
import { Container } from 'typedi';
import { QuestionCategory, QuestionStatus } from '../../entity/question/Question.model';
import { QuestionService } from '../../entity/question/Question.service';
import { AuthInfo } from '../../plugins/auth';
import {
  CreateQuestionRequestPayload,
  GetQuestionsRequestQuery
} from '../../validation-schema-types/types';
import {
  PartiallyUpdateQuestionRequestParams,
  PartiallyUpdateQuestionRequestPayload
} from '../../validation-schema-types/types';
import { PartiallyUpdateQuestionRequest } from './questions.handler';

interface GetQuestionsRequest extends Hapi.Request {
  query: GetQuestionsRequestQuery;
}

export const getQuestionsHandler: Hapi.RouteHandler = async (req: GetQuestionsRequest, reply) => {
  const questionService = Container.get(QuestionService);
  const category = QuestionCategory[req.query.category];
  const level = req.query.level;

  if (!req.query.status || !isAdmin(req.auth)) {
    return reply(
      questionService.findAcceptedBy({ category, level })
    );
  }

  if (req.query.status.length === 1) {
    const status = req.query.status[0];
    return reply(
      questionService.findBy({ category, level, status })
    );
  }

  return reply(
    questionService.findBy({ category, level })
  );
};

const isAdmin = (auth: RequestAuthenticationInformation): boolean => {
  console.log(auth);
  const user = auth && auth.isAuthenticated ? auth.credentials as AuthInfo : null;
  const isUserAdmin = (user && user.role === 'admin') || false;
  return isUserAdmin;
};

export interface CreateQuestionRequest extends Hapi.Request {
  payload: CreateQuestionRequestPayload;
}

const getQuestionStatusForAuth = (auth: RequestAuthenticationInformation): QuestionStatus => {
  return isAdmin(auth) ? QuestionStatus.accepted : QuestionStatus.pending;
};

export const createQuestionHandler: Hapi.RouteHandlerParam<CreateQuestionRequest> = async (req, reply) => {
  const questionService = Container.get(QuestionService);

  const { question, level, category } = req.payload;

  return reply(
    questionService.countByQuestion(question)
      .then((sameQuestionCount) => {
        if (sameQuestionCount > 0) {
          throw Boom.conflict('This question exists');
        }

        return questionService.addNew({
          question,
          level,
          category: category as QuestionCategory,
          status: getQuestionStatusForAuth(req.auth)
        });
      })
  );
};

export interface PartiallyUpdateQuestionRequest {
  payload: PartiallyUpdateQuestionRequestPayload;
  params: PartiallyUpdateQuestionRequestParams;
}

export const partiallyUpdateQuestionHandler: Hapi.RouteHandlerParam<PartiallyUpdateQuestionRequest> = (async (req, reply) => {
  const questionService = Container.get(QuestionService);
  return reply(
    questionService.updateStatusById(req.params.id, req.payload.status)
  );
});
