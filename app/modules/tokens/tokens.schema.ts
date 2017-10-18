import * as Joi from 'joi';

export const CreateTokenRequestPayloadSchema = Joi.object().required().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const CreateTokenRequestSchema = {
  payload: CreateTokenRequestPayloadSchema,
};

export const CreateTokenResponseSchema = Joi.object().keys({
  token: Joi.string().required(),
  user: Joi.object().required().keys({
    id: Joi.number().required(),
    email: Joi.string().email().required(),
    role: Joi.string().required(),
  }).notes('type:UserToken'),
});
