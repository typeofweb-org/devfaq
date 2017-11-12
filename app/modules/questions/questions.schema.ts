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

type JoiConstructor = (typeof Joi);
type JoiWithCommaDelimited = JoiConstructor & {
  commaDelimited(): {
    items(params: any): Joi.Schema
  };
};

const customJoi = Joi.extend({
  name: 'commaDelimited',
  base: Joi.string(),
  language: {
    items: '{{error}}',
  },
  pre(value: string, _state, _options): any {
    return value.split(',');
  },
  rules: [{
    name: 'items',
    params: {
      items: Joi.any()
    },
    validate(params: { items: Joi.Schema }, value: string[], state, options): any {
      const validation = Joi.array().items(params.items).validate(value);
      if (validation.error) {
        return this.createError('commaDelimited.items', { error: validation.error }, state, options);
      } else {
        return validation.value;
      }
    }
  }]
}) as JoiWithCommaDelimited;

export const GetQuestionsRequestQuerySchema = Joi.object().keys({
  category: QuestionCategoryJoiSchema,
  status: customJoi.commaDelimited().items(QuestionStatusJoiSchema)
  // .array().items(QuestionStatusJoiSchema).optional(),
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
