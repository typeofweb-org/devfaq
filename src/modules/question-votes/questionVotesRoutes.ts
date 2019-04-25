import Joi from 'joi';

export const CreateQuestionVoteRequestSchema = {
  query: Joi.object({
    _userId: Joi.number()
      .integer()
      .required(),
    _questionId: Joi.number()
      .integer()
      .required(),
  }).required(),
};

export const CreateQuestionVoteResponseSchema = Joi.object({
  data: Joi.object({
    _userId: Joi.number()
      .integer()
      .required(),
    _questionId: Joi.number()
      .integer()
      .required(),
  }).required(),
});
