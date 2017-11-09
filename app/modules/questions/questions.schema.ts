import * as Joi from 'joi';
import { questionCategories, questionStatuses } from '../../entity/question/Question.model';

export const QuestionCategoryJoiSchema = Joi.string().valid(questionCategories).required();
export const QuestionStatusJoiSchema = Joi.string().valid(questionStatuses).required();
export const OneQuestionJoiSchema = Joi.object().keys({
  id: Joi.number().integer().required(),
  question: Joi.string().required(),
  category: QuestionCategoryJoiSchema,
  level: Joi.string().optional(),
  answer: Joi.string().allow('').optional(),
  acceptedAt: Joi.date().optional()
});

export const GetQuestionsRequestQuerySchema = Joi.object().keys({
  category: QuestionCategoryJoiSchema
});

export const GetQuestionsRequestSchema = {
  query: GetQuestionsRequestQuerySchema
};

export const GetQuestionsResponseSchema = Joi.array().items(OneQuestionJoiSchema);

export const CreateQuestionRequestPayloadSchema = Joi.object().keys({
  question: Joi.string().required(),
  level: Joi.string().required(),
  category: QuestionCategoryJoiSchema
});

export const CreateQuestionRequestSchema = {
  payload: CreateQuestionRequestPayloadSchema
};

export const CreateQuestionResponseSchema = Joi.object().keys({
  id: Joi.number().integer().required(),
  question: Joi.string().required(),
  category: QuestionCategoryJoiSchema,
  level: Joi.string().optional(),
  answer: Joi.string().allow('').optional(),
  status: QuestionStatusJoiSchema
});
