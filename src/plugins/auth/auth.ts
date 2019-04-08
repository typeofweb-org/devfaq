import Hapi from 'hapi';
import { googleAuthProvider, GoogleAuthProviderOptions } from './googleAuthProvider';
import AuthBearer from 'hapi-auth-bearer-token';
import { Session } from '../../models/Session';
import { User } from '../../models/User';
import { Op } from 'sequelize';
import { meSessionRoutes } from './me';
import { getNewSessionValidUntil } from '../../utils/utils';

declare module 'hapi' {
  interface AuthCredentials {
    token: string;
    scope?: string[];
    session: Session;
  }
}

type AuthPluginOptions = GoogleAuthProviderOptions;

export async function maybeUpdateSessionValidity(session: Session) {
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

export const auth: Hapi.Plugin<AuthPluginOptions> = {
  async register(server, options) {
    await googleAuthProvider(server, options);

    await server.register({
      plugin: AuthBearer,
      options: {},
    });

    await server.auth.strategy('simple', 'bearer-access-token', {
      async validate(
        _request: Hapi.Request,
        token: string,
        _h: Hapi.ResponseToolkit
      ): Promise<{ isValid: boolean; credentials?: Hapi.AuthCredentials; artifacts?: object }> {
        let mutableSession: Session | null;
        try {
          mutableSession = await Session.findOne({
            where: {
              id: token,
              validUntil: {
                [Op.gte]: new Date(),
              },
            },
            include: [
              {
                model: User.scope('defaultScope', 'withSensitiveData'),
              },
            ],
          });
        } catch (err) {
          // tslint:disable-next-line:no-any
          return { isValid: false, credentials: {} as any };
        }

        if (!mutableSession) {
          // tslint:disable-next-line:no-any
          return { isValid: false, credentials: {} as any };
        }

        const role =
          mutableSession._user && mutableSession._user._role && mutableSession._user._role.name;
        const userId = mutableSession._user && mutableSession._user.id;
        const scope = ['user', `user-${userId}`, role].filter(
          (v): v is string => typeof v === 'string'
        );

        await maybeUpdateSessionValidity(mutableSession);

        return { isValid: true, credentials: { token, session: mutableSession, scope } };
      },
    });

    await server.auth.default({
      strategy: 'simple',
      mode: 'required',
    });

    await server.route(meSessionRoutes);
  },
  multiple: false,
  name: 'devfaq-api Auth Plugin',
  version: '1.0.0',
};
