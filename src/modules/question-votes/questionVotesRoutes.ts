import Joi from 'joi';

const QuestionVoteSchema = Joi.object({
  _userId: Joi.number()
    .integer()
    .required(),
  _questionId: Joi.number()
    .integer()
    .required(),
});

export const CreateQuestionVoteRequestSchema = {
  payload: QuestionVoteSchema.required(),
};

export const CreateQuestionVoteResponseSchema = Joi.object({
  data: QuestionVoteSchema.required(),
});
