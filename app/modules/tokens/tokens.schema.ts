import * as Joi from 'joi';

export const CreateTokenRequestPayloadSchema = Joi.object()
  .required()
  .keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required(),
  });

export const CreateTokenRequestSchema = {
  payload: CreateTokenRequestPayloadSchema,
};

export const CreateTokenResponseSchema = Joi.object().keys({
  token: Joi.string()
    .required()
    .description(`JWT – split by <code>.</code> and base64 decode`),
});

export const ValidateTokenResponseSchema = Joi.object().keys({
  id: Joi.number(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  emailAddress: Joi.string(),
  firstName: Joi.string()
    .allow(null)
    .optional(),
  lastName: Joi.string()
    .allow(null)
    .optional(),
  role: Joi.string()
    .allow(null)
    .optional(),
});
