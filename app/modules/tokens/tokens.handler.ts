import * as Boom from 'boom';
import * as Hapi from 'hapi';
import { Container } from 'typedi';
import { UserService } from '../../entity/user/User.service';
import { UserIncorrectPassword, UserNotFound } from '../../exception/exceptions';
import { CreateTokenRequestPayload } from '../../validation-schema-types/types';

interface CreateTokenRequest extends Hapi.Request {
  payload: CreateTokenRequestPayload;
}

export const createTokenHandler: Hapi.RouteHandler = async (req: CreateTokenRequest, reply) => {
  const userService = Container.get(UserService);

  const result = userService
    .verifyCredentials(req.payload.email, req.payload.password)
    .catch(UserNotFound, () => {
      return Boom.notFound('User does not exist');
    }).catch(UserIncorrectPassword, () => {
      return Boom.forbidden('Provided password is incorrect');
    });

  return reply(result);
};
