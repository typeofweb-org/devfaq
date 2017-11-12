import * as Joi from 'joi';
import { questionCategories, questionStatuses } from '../../entity/question/Question.model';
import { JoiCommaDelimited } from '../../services/commaDelimited.joi';

const QuestionCategorySchema = Joi.string().valid(questionCategories).required().notes('type:QuestionCategory');
const QuestionStatusSchema = Joi.string().valid(questionStatuses).required().notes('type:QuestionStatus');
export const OneQuestionJoiSchema = Joi.object().keys({
  id: Joi.number().integer().required(),
  question: Joi.string().required(),
  category: QuestionCategorySchema,
  level: Joi.string().optional(),
  answer: Joi.string().allow('').optional(),
  acceptedAt: Joi.date().optional()
});

export const GetQuestionsRequestQuerySchema = Joi.object().keys({
  category: QuestionCategorySchema,
  status: JoiCommaDelimited.commaDelimited().items(QuestionStatusSchema).notes('type:QuestionStatuses')
});

export const GetQuestionsRequestSchema = {
  query: GetQuestionsRequestQuerySchema
};

export const GetQuestionsResponseSchema = Joi.array().items(OneQuestionJoiSchema);

export const CreateQuestionRequestPayloadSchema = Joi.object().keys({
  question: Joi.string().required(),
  level: Joi.string().required(),
  category: QuestionCategorySchema
});

export const CreateQuestionRequestSchema = {
  payload: CreateQuestionRequestPayloadSchema
};

export const CreateQuestionResponseSchema = Joi.object().keys({
  id: Joi.number().integer().required(),
  question: Joi.string().required(),
  category: QuestionCategorySchema,
  level: Joi.string().optional(),
  answer: Joi.string().allow('').optional(),
  status: QuestionStatusSchema
});
