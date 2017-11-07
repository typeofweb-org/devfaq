import * as Boom from 'boom';
import * as Hapi from 'hapi';
import { CreateQuestionRequestPayload, GetQuestionsRequestQuery } from '../../validation-schema-types/types';

interface GetQuestionsRequest extends Hapi.Request {
  query: GetQuestionsRequestQuery;
}

export const getQuestionsHandler: Hapi.RouteHandler = async (_req: GetQuestionsRequest, reply) => {
  return reply(Boom.notImplemented());
};

interface CreateQuestionRequest extends Hapi.Request {
  payload: CreateQuestionRequestPayload;
}

export const createQuestionHandler: Hapi.RouteHandler = async (_req: CreateQuestionRequest, reply) => {
  return reply(Boom.notImplemented());
};
