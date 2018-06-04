import * as Hapi from 'hapi';
import { ServerStateCookieConfiguationObject } from 'hapi';
import * as HapiAuthJwt from 'hapi-auth-jwt2';
import { UserRoles } from '../entity/user/User.model';
import { configService } from '../services/configService';

// tslint:disable-next-line:no-empty-interface
export interface AuthPluginOptions {}

export interface AuthInfo {
  id: number;
  role: UserRoles;
  scope: false | string | string[];
}

type AuthMethodNext = (
  err: Error | null,
  result: any,
  options?: AuthInfo
) => void;

const validate = (
  decoded: AuthInfo,
  _request: Hapi.Request,
  callback: AuthMethodNext
) => {
  if (!decoded || !decoded.id) {
    return callback(null, false);
  } else {
    const scope = [decoded.role];
    return callback(null, true, { ...decoded, scope });
  }
};

const after = (server: Hapi.Server) => {
  server.auth.strategy('jwt', 'jwt', {
    key: configService.getJwtSecret(),
    tokenType: 'Bearer',
    urlKey: false,
    validateFunc: validate,
    verifyOptions: { algorithms: ['HS256'] }
  });

  server.auth.default('jwt');

  const cookieOptions: ServerStateCookieConfiguationObject = {
    // tslint:disable-next-line:no-magic-numbers
    ttl: 365 * 24 * 60 * 60 * 1000,
    encoding: 'none' as 'none',
    isSecure: process.env.NODE_ENV === 'production',
    isHttpOnly: true,
    clearInvalid: false,
    strictHeader: true,
    isSameSite: 'Lax' as 'Lax',
    domain: process.env.COOKIE_DOMAIN,
    path: '/'
  };

  server.state('token', cookieOptions);
};

export const auth: Hapi.PluginRegistrationObject<AuthPluginOptions> = {
  register(server, _options, next) {
    server
      .register(HapiAuthJwt)
      .then(() => after(server))
      .then(() => {
        next();
      })
      .catch(next);
  }
};

auth.register.attributes = {
  name: 'Fefaq Auth Plugin',
  version: '1.0.0'
};
