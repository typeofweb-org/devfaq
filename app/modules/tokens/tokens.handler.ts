import * as Boom from 'boom';
import * as Hapi from 'hapi';
import * as Jwt from 'jsonwebtoken';
import { Container } from 'typedi';
import { UserEntity } from '../../entity/user/User.model';
import { UserService } from '../../entity/user/User.service';
import { UserIncorrectPassword, UserNotFound } from '../../exception/exceptions';
import { CreateTokenRequestPayload, CreateTokenResponse } from '../../validation-schema-types/types';

interface CreateTokenRequest extends Hapi.Request {
  payload: CreateTokenRequestPayload;
}

const createToken = (user: UserEntity): string => {
  return Jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    'NeverShareYourSecret', // @todo
    { algorithm: 'HS256', expiresIn: '1h' }
  );
};

export const createTokenHandler: Hapi.RouteHandler = async (req: CreateTokenRequest, reply) => {
  const userService = Container.get(UserService);

  return reply(
    userService
      .verifyCredentials(req.payload.email, req.payload.password)
      .catch(UserNotFound, () => {
        throw Boom.notFound('User does not exist');
      }).catch(UserIncorrectPassword, () => {
        throw Boom.forbidden('Provided password is incorrect');
      })
      .then((user) => {
        const response: CreateTokenResponse = {
          token: createToken(user)
        };
        return response;
      })
  );
};
