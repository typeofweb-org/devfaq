import * as Joi from 'joi';
import { questionCategories, questionStatuses } from '../../entity/question/Question.model';
import { JoiCommaDelimited } from '../../services/commaDelimited.joi';
import { CommonHeaders } from '../common.schema';

const QuestionCategorySchema = Joi.string().valid(questionCategories).required().notes('type:QuestionCategory');
const QuestionStatusSchema = Joi.string().valid(questionStatuses).required().notes('type:QuestionStatus');
const QuestionLevelSchema = Joi.string();
export const OneQuestionJoiSchema = Joi.object().keys({
  id: Joi.number().integer().required(),
  question: Joi.string().required(),
  category: QuestionCategorySchema,
  level: Joi.string().optional(),
  answer: Joi.string().allow('').optional(),
  acceptedAt: Joi.date().optional().allow(null)
});

export const GetQuestionsRequestQuerySchema = Joi.object().keys({
  category: QuestionCategorySchema.optional(),
  status: JoiCommaDelimited.commaDelimited().items(QuestionStatusSchema).notes('type:QuestionStatuses'),
  level: JoiCommaDelimited.commaDelimited().items(QuestionLevelSchema).notes('type:QuestionLevels'),
});

export const GeneratePdfRequestQuerySchema = Joi.object().keys({
  question: JoiCommaDelimited.commaDelimited().items(Joi.number()).notes('type:number[]').required(),
});

export const GeneratePdfRequestSchema = {
  query: GeneratePdfRequestQuerySchema
};

export const GetQuestionsRequestSchema = {
  headers: CommonHeaders,
  query: GetQuestionsRequestQuerySchema
};

export const GetQuestionsResponseSchema = Joi.array().items(OneQuestionJoiSchema);

export const CreateQuestionRequestPayloadSchema = Joi.object().keys({
  question: Joi.string().required(),
  level: Joi.string().required(),
  category: QuestionCategorySchema
});

export const CreateQuestionRequestSchema = {
  headers: CommonHeaders,
  payload: CreateQuestionRequestPayloadSchema
};

export const CreateQuestionResponseSchema = OneQuestionJoiSchema;

export const PartiallyUpdateQuestionRequestPayloadSchema = Joi.object().keys({
  status: QuestionStatusSchema,
});

export const PartiallyUpdateQuestionRequestParamsSchema = Joi.object().keys({
  id: Joi.number().integer().required()
});

export const PartiallyUpdateQuestionRequestSchema = {
  headers: CommonHeaders,
  payload: PartiallyUpdateQuestionRequestPayloadSchema,
  params: PartiallyUpdateQuestionRequestParamsSchema
};

export const PartiallyUpdateQuestionResponseSchema = OneQuestionJoiSchema;

export const DeleteQuestionRequestParamsSchema = Joi.object().keys({
  id: Joi.number().integer().required()
});

export const DeleteQuestionRequestSchema = {
  headers: CommonHeaders,
  params: DeleteQuestionRequestParamsSchema
};

export const DeleteQuestionResponseSchema = Joi.any();
