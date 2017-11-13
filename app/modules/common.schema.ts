import * as Joi from 'joi';
export const CommonHeaders = Joi.object({
  Authorization: Joi.string().optional()
}).unknown();
