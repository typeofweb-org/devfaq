import Hapi from 'hapi';
import HapiAuthCookie from 'hapi-auth-cookie';
import Bell from 'bell';
import Boom from 'boom';
import GitHubAuthPlugin, { GitHubAuthPluginConfig } from './github';
import { User } from '../../models/User';
import { Op } from 'sequelize';

declare module 'hapi' {
  interface AuthCredentials {
    id: User['id'];
  }
}

interface RequiredOptions {
  cookieDomain: string;
  isProduction: boolean;
  cookiePassword: string;
}

type ProviderOptions = GitHubAuthPluginConfig | {};
type AuthPluginOptions = RequiredOptions & ProviderOptions;

type AuthProviderNext = (
  data: {
    serviceName: Bell.Provider;
    externalServiceId: number | string;
    email: string;
  },
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

        const user = await User.findByPk(session.id);

        if (!user) {
          return { valid: false };
        }

        return { valid: true, credentials: { id: user.id } };
      },
    };
    await server.auth.strategy('session', 'cookie', cookieOptions);

    const next: AuthProviderNext = async (
      { serviceName, externalServiceId, email },
      request,
      _h
    ) => {
      console.log({ serviceName, externalServiceId, email });

      const userWithGitHubId = await User.findOne({
        where: {
          socialLogin: {
            [serviceName]: {
              [Op.eq]: externalServiceId,
            },
          },
        },
      });

      if (userWithGitHubId) {
        request.cookieAuth.set({ id: userWithGitHubId.id });
        return userWithGitHubId;
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
          });

          return user;
        }
      }

      return null;
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
