import Hapi from 'hapi';
import HapiAuthCookie from 'hapi-auth-cookie';
import Bell from 'bell';
import Boom from 'boom';
import GitHubAuthPlugin, { GitHubAuthPluginConfig } from './github';
import { User } from '../../models/User';
import { Op } from 'sequelize';
import { Session } from '../../models/Session';
import { isString } from 'util';

declare module 'hapi' {
  interface AuthCredentials {
    session: Session;
  }
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
  request: Hapi.Request<any, any>,
  h: Hapi.ResponseToolkit
) => Hapi.Lifecycle.ReturnValue;

export interface AuthProviderOptions {
  next: AuthProviderNext;
}

const AuthPlugin: Hapi.Plugin<AuthPluginOptions> = {
  multiple: false,
  name: 'DEVFAQ-API Auth Plugin',
  version: '1.0.0',
  async register(server, options) {
    await server.register([{ plugin: Bell }, { plugin: HapiAuthCookie }] as Array<
      Hapi.ServerRegisterPluginObject<unknown>
    >);

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
      appendNext: 'redirect',
      async validateFunc(_request, session: { id?: string | number } | undefined) {
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
          include: [User],
        });

        if (!sessionModel) {
          return { valid: false };
        }

        const roleId = sessionModel._user && sessionModel._user._roleId;
        const userId = sessionModel._user && sessionModel._user.id;
        const scope = ['user', `user-${userId}`, roleId].filter(isString);

        return { valid: true, credentials: { session: sessionModel, scope } };
      },
    };
    await server.auth.strategy('session', 'cookie', cookieOptions);
    await server.auth.default('session');

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

      const validUntil = new Date();
      // tslint:disable-next-line:no-magic-numbers
      validUntil.setHours(validUntil.getHours() + 2);

      const session = await Session.create({
        _userId: user.id,
        validUntil,
      });

      request.cookieAuth.set({ id: session.id });

      return session;
    };

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
  },
};

export default AuthPlugin;
