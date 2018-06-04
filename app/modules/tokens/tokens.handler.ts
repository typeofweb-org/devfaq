import * as Boom from 'boom';
import * as Hapi from 'hapi';
import { Container } from 'typedi';
import { UserService } from '../../entity/user/User.service';
import {
  UserIncorrectPassword,
  UserNotFound,
} from '../../exception/exceptions';
import { encryptionService } from '../../services/encryptionService';
import { AuthInfo } from '../../plugins/auth';
import {
  CreateTokenRequestPayload,
  CreateTokenResponse,
} from '../../validation-schema-types/types';

interface CreateTokenRequest extends Hapi.Request {
  payload: CreateTokenRequestPayload;
}

export const createTokenHandler: Hapi.RouteHandler = async (
  req: CreateTokenRequest,
  reply
) => {
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
        const token = encryptionService.createToken(user);
        const response: CreateTokenResponse = { token };
        reply.state('token', token);
        return response;
      })
  );
};

export const validateTokenHandler: Hapi.RouteHandler = async (
  req: CreateTokenRequest,
  reply
) => {
  if (!req.auth || !req.auth.isAuthenticated) {
    return reply(Promise.reject(Boom.notFound('Not authenticated')));
  }

  const authAinfo = req.auth.credentials as AuthInfo;

  const userService = Container.get(UserService);

  return reply(userService.getUserById(authAinfo.id));
};
