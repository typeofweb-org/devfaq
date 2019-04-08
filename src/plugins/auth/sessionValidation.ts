import Joi from 'joi';
import { userWithSensitiveDataSchema } from '../../modules/users/usersRoutes';

export const sessionWithUserSchema = Joi.object({
  id: Joi.string().required(),
  validUntil: Joi.date().required(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
  _user: userWithSensitiveDataSchema,
}).required();
