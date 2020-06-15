import { isString } from 'util';

import Bell from '@hapi/bell';
import Boom from '@hapi/boom';
import HapiAuthCookie from '@hapi/cookie';
import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import { Op } from 'sequelize';

import { Session } from '../../models/Session';
import { User } from '../../models/User';

import GitHubAuthPlugin from './github';
import type { GitHubAuthPluginConfig } from './github';
import { createNewSession, getNewSessionValidUntil } from './session';

declare module '@hapi/hapi' {
  interface AuthCredentials {
    session: Session;
  }
}

declare module '@hapi/boom' {
  export function isBoom(err: any, statusCode?: number): err is Boom;
}

interface RequiredOptions {
  cookieDomain: string;
  isProduction: boolean;
  cookiePassword: string;
}

type ProviderOptions = GitHubAuthPluginConfig | {};
type AuthPluginOptions = RequiredOptions & ProviderOptions;

interface AuthUserData {
  serviceName: Bell.Provider;
  externalServiceId: number | string;
  email: string;
  firstName?: string;
  lastName?: string;
}

type AuthProviderNext = (
  data: AuthUserData,
  // tslint:disable-next-line:no-any
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => Hapi.Lifecycle.ReturnValue;

export interface AuthProviderOptions {
  next: AuthProviderNext;
}

const meAuthSchema = Joi.object({
  keepMeSignedIn: Joi.boolean().required(),
  validUntil: Joi.date().required(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
  version: Joi.number().required(),
  _userId: Joi.number().required(),
  _user: Joi.object({
    id: Joi.number().required(),
    email: Joi.string().required(),
    createdAt: Joi.date().required(),
    updatedAt: Joi.date().required(),
    _roleId: Joi.string().required(),
    firstName: Joi.string().allow('', null),
    lastName: Joi.string().allow('', null),
    // socialLogin: Joi.object({
    //   github: Joi.alternatives(Joi.string(), Joi.number().integer()),
    // }).allow(null),
    socialLogin: Joi.any(),
  }).required(),
});

async function maybeUpdateSessionValidity(session: Session) {
  const validUntil = session.validUntil;
  const newValidUntil = getNewSessionValidUntil(session.keepMeSignedIn);

  // tslint:disable-next-line:no-magic-numbers
  const ONE_MINUTE = 1000 * 60;
  if (newValidUntil.getTime() - validUntil.getTime() <= ONE_MINUTE) {
    return; // update at most after 1 minute
  }

  session.validUntil = newValidUntil;
  await session.save();
}

const findOrCreateAccountFor = async ({
  serviceName,
  externalServiceId,
  email,
  firstName,
  lastName,
}: AuthUserData): Promise<User> => {
  const userWithSocialLogin = await User.findOne({
    where: {
      socialLogin: {
        [serviceName]: {
          [Op.eq]: externalServiceId,
        },
      },
    },
  });

  if (userWithSocialLogin) {
    return userWithSocialLogin;
  } else {
    const userWithEmail = await User.findOne({
      where: {
        email,
      },
    });
    if (userWithEmail) {
      // @todo merge accounts
      throw Boom.conflict('User with provided email already exists!');
    } else {
      const user = await User.create({
        email,
        socialLogin: { [serviceName]: externalServiceId },
        firstName,
        lastName,
      });

      return user;
    }
  }
};

const next: AuthProviderNext = async (authData, request, _h) => {
  const user = await findOrCreateAccountFor(authData);
  const session = await createNewSession(user, false);

  request.cookieAuth.set({ id: session.id });

  return `
<!doctype>
<html>
  <script>window.close();</script>
</html>
  `.trim();
};

const AuthPlugin: Hapi.Plugin<AuthPluginOptions> = {
  multiple: false,
  name: 'DEVFAQ-API Auth Plugin',
  version: '1.0.0',
  async register(server, options) {
    await server.register(Bell);
    await server.register(HapiAuthCookie);

    const cookieOptions: HapiAuthCookie.Options = {
      cookie: {
        name: 'session',
        password: options.cookiePassword,
        // tslint:disable-next-line:no-magic-numbers
        ttl: 365 * 24 * 60 * 60 * 1000,
        encoding: 'iron' as 'iron',
        isSecure: options.isProduction,
        isHttpOnly: true,
        clearInvalid: true,
        strictHeader: true,
        isSameSite: 'Lax' as 'Lax',
        domain: options.cookieDomain,
        path: '/',
      },
      async validateFunc(request, session: { id?: string | number } | undefined) {
        if (!session || !session.id) {
          return { valid: false };
        }

        const sessionModel = await Session.findOne({
          where: {
            id: session.id,
            validUntil: {
              [Op.gte]: new Date(),
            },
          },
          include: [User.scope(['defaultScope', 'withSensitiveData'])],
        });

        if (!sessionModel) {
          request?.cookieAuth.clear();
          return { valid: false };
        }

        await maybeUpdateSessionValidity(sessionModel);

        const roleId = sessionModel._user && sessionModel._user._roleId;
        const userId = sessionModel._user && sessionModel._user.id;
        const scope = ['user', `user-${userId}`, roleId].filter(isString);

        return { valid: true, credentials: { session: sessionModel, scope } };
      },
    };
    await server.auth.strategy('session', 'cookie', cookieOptions);
    await server.auth.default('session');

    if ('githubClientId' in options && options.githubClientId && options.githubClientSecret) {
      const githubOptions: GitHubAuthPluginConfig & AuthProviderOptions = {
        ...options,
        next,
      };
      await server.register({
        plugin: GitHubAuthPlugin,
        options: githubOptions,
      });
    }

    await server.route({
      method: 'POST',
      path: '/logout',
      options: {
        tags: ['api', 'oauth'],
        auth: {
          mode: 'try',
          strategy: 'session',
        },
      },
      async handler(request) {
        request.cookieAuth.clear();
        if (request.auth.credentials && request.auth.credentials.session) {
          await Session.destroy({
            where: {
              id: request.auth.credentials.session.id,
            },
          });
        }

        return null;
      },
    });

    await server.route({
      method: 'GET',
      path: '/me',
      options: {
        tags: ['api', 'oauth'],
        auth: {
          mode: 'try',
          strategy: 'session',
        },
        response: {
          schema: Joi.object({
            data: meAuthSchema.required().allow(null),
          }).required(),
        },
      },
      async handler(request) {
        if (request.auth.credentials && request.auth.credentials.session) {
          return { data: request.auth.credentials.session.toJSON() };
        }

        return { data: null };
      },
    });
  },
};

export default AuthPlugin;
