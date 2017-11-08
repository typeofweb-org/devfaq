import * as Joi from 'joi';
import { questionCategories, questionStatuses } from '../../entity/question/Question.model';

const QuestionCategorySchema = Joi.string().valid(questionCategories);
const QuestionStatusSchema = Joi.string().valid(questionStatuses);

export const GetQuestionsRequestQuerySchema = Joi.object().keys({
  category: Joi.string().required()
});

export const GetQuestionsRequestSchema = {
  query: GetQuestionsRequestQuerySchema
};

export const GetQuestionsResponseSchema = Joi.object().keys({
  id: Joi.number().integer().required(),
  question: Joi.string().required(),
  category: QuestionCategorySchema.required(),
  level: Joi.string().optional(),
  answer: Joi.string().optional()
});

export const CreateQuestionRequestPayloadSchema = Joi.object().keys({
  question: Joi.string().required(),
  level: Joi.string().required(),
  category: QuestionCategorySchema.required()
});

export const CreateQuestionRequestSchema = {
  payload: CreateQuestionRequestPayloadSchema
};

export const CreateQuestionResponseSchema = Joi.object().keys({
  id: Joi.number().integer().required(),
  question: Joi.string().required(),
  category: QuestionCategorySchema.required(),
  level: Joi.string().optional(),
  answer: Joi.string().optional(),
  status: QuestionStatusSchema.required()
});
