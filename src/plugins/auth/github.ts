import Hapi from 'hapi';
import Bell from 'bell';
import Boom from 'boom';
import fetch from 'node-fetch';
import { AuthProviderOptions } from '.';

export interface GitHubAuthPluginConfig {
  githubClientId: string;
  githubClientSecret: string;
  githubPassword: string;
  isProduction: boolean;
}

interface GitHubCredentials {
  token: string;
  profile: {
    id: number;
    username: string;
    displayName: string;
    email: string | null;
    raw: unknown;
  };
}

const getNames = (credentials: GitHubCredentials): { firstName: string; lastName: string } => {
  if (!credentials.profile || !credentials.profile.displayName) {
    return { firstName: '', lastName: '' };
  }

  const [firstName, ...rest] = credentials.profile.displayName.split(' ');
  return {
    firstName,
    lastName: rest.join(' '),
  };
};

const GitHubAuthPlugin: Hapi.Plugin<GitHubAuthPluginConfig & AuthProviderOptions> = {
  multiple: false,
  name: 'DEVFAQ-API GitHub Auth Plugin',
  version: '1.0.0',
  async register(server, options) {
    const bellOptions: Bell.BellOptions = {
      provider: 'github',
      password: options.githubPassword,
      clientId: options.githubClientId,
      clientSecret: options.githubClientSecret,
      isSecure: options.isProduction,
    };
    await server.auth.strategy('github', 'bell', bellOptions);

    await server.route({
      method: ['GET', 'POST'],
      path: '/github',
      options: {
        auth: {
          mode: 'try',
          strategy: 'github',
        },
        tags: ['api', 'oauth', 'github'],
      },
      async handler(request, h) {
        if (!request.auth.isAuthenticated) {
          return request.auth.error.message;
        }

        const gitHubCredentials = (request.auth.credentials as unknown) as GitHubCredentials;

        const token = gitHubCredentials.token;

        const res = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `token ${token}`,
          },
        });

        if (!res.ok) {
          throw Boom.serverUnavailable('GitHub responded with an error!');
        }

        const emails = (await res.json()) as Array<{
          email: string;
          primary: boolean;
          verified: boolean;
          visibility: unknown;
        }>;
        const primaryEmail = emails.find(e => e.primary && e.verified);

        if (!primaryEmail) {
          throw Boom.unauthorized('Your primary email is not verified!');
        }

        const { firstName, lastName } = getNames(gitHubCredentials);

        return options.next(
          {
            serviceName: 'github',
            externalServiceId: gitHubCredentials.profile.id,
            email: primaryEmail.email,
            firstName,
            lastName,
          },
          request,
          h
        );
      },
    });
  },
};

export default GitHubAuthPlugin;
