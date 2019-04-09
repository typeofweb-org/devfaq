import Joi from 'typesafe-joi';
import { questionCategories, questionStatuses, questionLevels } from '../../models-consts';

export const QuestionCategorySchema = Joi.string().valid(questionCategories);

export const QuestionStatusSchema = Joi.string().valid(questionStatuses);

export const QuestionLevelSchema = Joi.string().valid(questionLevels);

export const QuestionSchema = Joi.object({
  id: Joi.number()
    .integer()
    .required(),
  question: Joi.string().required(),
  _categoryId: QuestionCategorySchema.required(),
  _levelId: QuestionLevelSchema.required(),
  _statusId: QuestionStatusSchema.required(),
  acceptedAt: Joi.date().allow(null),
}).required();

export const GetQuestionsRequestSchema = {
  query: Joi.object({
    category: QuestionCategorySchema,
    status: Joi.array().items(questionStatuses),
    level: Joi.array().items(questionLevels),
  }).required(),
};

export const GetQuestionsResponseSchema = Joi.array()
  .items(QuestionSchema)
  .required();
