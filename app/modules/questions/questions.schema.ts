import * as Joi from 'joi';

export const QuestionCategory = Joi.string().allow().required();

export const GetQuestionsRequestQuerySchema = Joi.object().keys({
  category: Joi.string().required()
});

export const GetQuestionsRequestSchema = {
  query: GetQuestionsRequestQuerySchema
};

export const GetQuestionsResponseSchema = Joi.object().keys({
  id: Joi.string().required(),
  question: Joi.string().required(),
  category: QuestionCategory,
  level: Joi.string().optional(),
  answer: Joi.string().optional()
});

export const CreateQuestionRequestQuerySchema = Joi.object().keys({
  category: Joi.string().required()
});

export const CreateQuestionRequestSchema = {
  query: CreateQuestionRequestQuerySchema
};

export const CreateQuestionResponseSchema = Joi.object().keys({
  id: Joi.string().required(),
  question: Joi.string().required(),
  category: QuestionCategory,
  level: Joi.string().optional(),
  answer: Joi.string().optional()
});
