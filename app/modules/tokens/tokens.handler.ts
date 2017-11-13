import * as Boom from 'boom';
import * as Hapi from 'hapi';
import { Container } from 'typedi';
import { UserService } from '../../entity/user/User.service';
import { UserIncorrectPassword, UserNotFound } from '../../exception/exceptions';
import { encryptionService } from '../../services/encryptionService';
import { CreateTokenRequestPayload, CreateTokenResponse } from '../../validation-schema-types/types';

interface CreateTokenRequest extends Hapi.Request {
  payload: CreateTokenRequestPayload;
}

export const createTokenHandler: Hapi.RouteHandler = async (req: CreateTokenRequest, reply) => {
  const userService = Container.get(UserService);

  return reply(
    userService
      .verifyCredentials(req.payload.email, req.payload.password)
      .catch((err) => {
        if (err instanceof UserNotFound) {
          throw Boom.notFound('User does not exist');
        } else if (err instanceof UserIncorrectPassword) {
          throw Boom.forbidden('Provided password is incorrect');
        }
        throw err;
      })
      .then((user) => {
        const response: CreateTokenResponse = {
          token: encryptionService.createToken(user)
        };
        return response;
      })
  );
};
