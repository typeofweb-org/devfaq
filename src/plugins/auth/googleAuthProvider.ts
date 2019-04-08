import Hapi from 'hapi';
import Joi from 'joi';

import { OAuth2Client } from 'google-auth-library';
import Boom from 'boom';
import { upsertUserWithDetails } from './account';
import { createNewSession } from './session';
import { sessionWithUserSchema } from './sessionValidation';

export interface GoogleAuthProviderOptions {
  googleClientId: string;
}

export async function googleAuthProvider(server: Hapi.Server, options: GoogleAuthProviderOptions) {
  const client = new OAuth2Client(options.googleClientId);

  async function verifyToken(token: string) {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: [
        options.googleClientId,
        // @todo make it configurable?
        // mobile token
        '1006739887137-8b63o4nhp9vn9qdl1rj4beat3h5sbj3s.apps.googleusercontent.com',
      ],
    });

    if (!ticket) {
      throw Boom.notFound(`Google couldn't authenticate the user`);
    }

    const payload = ticket.getPayload();

    if (!payload) {
      throw Boom.notFound(`Google couldn't find the payload`);
    }

    const userId = payload.sub;
    const { email, name, family_name, given_name } = payload;

    if (!email) {
      throw Boom.badData('Google Auth API returned invalid email!');
    }

    return { email, name, family_name, given_name, userId };
  }

  interface GoogleAuthPayload {
    idToken: string;
    keepMeSignedIn: boolean;
  }

  const googleAuthProviderHandler: Hapi.Lifecycle.Method = async (request, _h) => {
    const { idToken, keepMeSignedIn } = request.payload as GoogleAuthPayload;

    const { email, name, userId: googleUserId } = await verifyToken(idToken);
    const user = await upsertUserWithDetails({ email, name, googleUserId });
    return createNewSession(user, keepMeSignedIn);
  };

  const googleAuthProviderRoute: Hapi.ServerRoute = {
    method: 'POST',
    path: '/google',
    options: {
      auth: false,
      description: 'Auth Google Provider',
      tags: ['api', 'auth'],
      validate: {
        payload: Joi.object({
          idToken: Joi.string().required(),
          keepMeSignedIn: Joi.boolean().default(false),
        }).required(),
      },
      response: {
        schema: sessionWithUserSchema,
      },
    },
    handler: googleAuthProviderHandler,
  };

  await server.route(googleAuthProviderRoute);
}
