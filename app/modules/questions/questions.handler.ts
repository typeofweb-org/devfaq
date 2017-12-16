import * as Boom from 'boom';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import { RequestAuthenticationInformation } from 'hapi';
import * as Hapi from 'hapi';
import * as htmlPdf from 'html-pdf';
import * as path from 'path';
import { Container } from 'typedi';
import { QuestionCategory, QuestionStatus } from '../../entity/question/Question.model';
import { QuestionService } from '../../entity/question/Question.service';
import { QuestionNotFound } from '../../exception/exceptions';
import { AuthInfo } from '../../plugins/auth';
import {
  PartiallyUpdateQuestionRequestParams,
  PartiallyUpdateQuestionRequestPayload
} from '../../validation-schema-types/types';
import { DeleteQuestionRequestParams, GeneratePdfRequestQuery } from '../../validation-schema-types/types';
import {
  CreateQuestionRequestPayload,
  GetQuestionsRequestQuery
} from '../../validation-schema-types/types';
import { PartiallyUpdateQuestionRequest } from './questions.handler';

import * as Commonmark from 'commonmark';
const CommonmarkReader = new Commonmark.Parser();
const CommonmarkWriter = new Commonmark.HtmlRenderer();

const templateFile = fs.readFileSync(path.join(__dirname, 'pdf-questions.html'), { encoding: 'utf-8' });
Handlebars.registerHelper('inc', (value: any) => {
  return Number.parseInt(value) + 1;
});
const templateFn = Handlebars.compile(templateFile);

interface GetQuestionsRequest extends Hapi.Request {
  query: GetQuestionsRequestQuery;
}

export const getQuestionsHandler: Hapi.RouteHandler = async (req: GetQuestionsRequest, reply) => {
  const questionService = Container.get(QuestionService);
  const category = req.query.category && QuestionCategory[req.query.category];
  const level = req.query.level;

  if (req.query.status && isAdmin(req.auth)) {
    const status = req.query.status;
    return reply(
      questionService.findBy({ category, level, status })
    );
  }

  return reply(
    questionService.findAcceptedBy({ category, level })
  );
};

const isAdmin = (auth: RequestAuthenticationInformation): boolean => {
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
          category,
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
    questionService
      .updateById(req.params.id, req.payload)
      .catch((err) => {
        if (err instanceof QuestionNotFound) {
          throw Boom.notFound('Question does not exist');
        }
        throw err;
      })
  );
});

export interface DeleteQuestionRequest {
  params: DeleteQuestionRequestParams;
}

export const deleteQuestionHandler: Hapi.RouteHandlerParam<DeleteQuestionRequest> = (async (req, reply) => {
  const questionService = Container.get(QuestionService);
  const noContentStatus = 204;

  return reply(
    questionService
      .removeById(req.params.id)
      .catch((err) => {
        if (err instanceof QuestionNotFound) {
          throw Boom.notFound('Question does not exist');
        }
        throw err;
      })
  ).code(noContentStatus);
});

interface GeneratePdfRequest extends Hapi.Request {
  query: GeneratePdfRequestQuery;
}

export const generatePdfHandler: Hapi.RouteHandlerParam<GeneratePdfRequest> = (async (req, reply) => {
  const ids = req.query.question ? req.query.question : [];

  const questionService = Container.get(QuestionService);

  const questions = await questionService.getAcceptedQuestionsByIds(ids);
  const renderedQuestions = questions.map((item) => {
    const question = CommonmarkReader.parse(item.question);
    item.question = CommonmarkWriter.render(question);
    return item;
  });

  const html = templateFn({ questions: renderedQuestions });
  htmlPdf.create(html, {
    format: 'A4',
    orientation: 'portrait',
    border: {
      top: '0.5cm',
      bottom: '0',
      left: '1cm',
      right: '1cm',
    },
    header: {
      height: '1cm',
      contents: 'FeFaq.pl — pytania rekrutacyjne dla front-end developerów',
    },
    footer: {
      height: '1cm',
      contents: {
        default: 'FeFaq.pl — strona {{page}} z {{pages}}'
      }
    },
    type: 'pdf'
  }).toBuffer((err, pdf) => {
    if (err) {
      reply(err);
      return;
    }

    reply(pdf)
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', 'attachment; filename=fefaq-questions.pdf');
  });
});
