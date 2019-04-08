import { User } from '../../models/User';
import { UserRole } from '../../models/UserRole';
import { WebClient } from '@slack/client';
import { getConfig } from '../../config';
import Boom from 'boom';
import { Currency } from '../../models/Currency';

interface UserDetails {
  email: string;
  name?: string;
  googleUserId?: string;
}

export interface SlackUser {
  id: string;
  team_id: string;
  name: string;
  deleted: boolean;
  color: string;
  real_name: string;
  tz: string;
  tz_label: string;
  tz_offset: number;
  profile: {
    avatar_hash: string;
    status_text: string;
    status_emoji: string;
    real_name: string;
    display_name: string;
    real_name_normalized: string;
    display_name_normalized: string;
    email: string;
    image_24: string;
    image_32: string;
    image_48: string;
    image_72: string;
    image_192: string;
    image_512: string;
    team: string;
  };
  is_admin: boolean;
  is_owner: boolean;
  is_primary_owner: boolean;
  is_restricted: boolean;
  is_ultra_restricted: boolean;
  is_bot: boolean;
  is_stranger: boolean;
  updated: number;
  is_app_user: boolean;
  has_2fa: boolean;
  locale: string;
}

async function addSlackDetailsToUser(user: User): Promise<User> {
  const client = new WebClient(getConfig('SLACK_TOKEN'));
  const slackResponse = await client.users.lookupByEmail({ email: user.email }).catch(_err => {
    /* ignore */
  });

  if (!slackResponse || !slackResponse.ok) {
    return user;
  }

  // tslint:disable-next-line:no-any
  const slackUser: SlackUser | undefined = (slackResponse as any).user;

  if (!slackUser) {
    return user;
  }

  user.slackId = slackUser.id;
  user.avatarUrl = slackUser.profile.image_192;
  return user.save();
}

export async function upsertUserWithDetails(details: UserDetails) {
  // @todo add more things here, especially when it's the first time log in
  // payment info etc.

  const userRole = await UserRole.findOne({
    where: {
      name: 'user',
    },
  });

  if (!userRole) {
    throw Boom.internal('User role user not found!');
  }

  const currency = await Currency.findOne({
    where: {
      name: 'USD',
    },
  });

  if (!currency) {
    throw Boom.internal('Currency USD not found!');
  }

  const [user] = await User.findOrCreate({
    where: {
      email: details.email,
    },
    defaults: {
      email: details.email,
      displayName: details.name,
      isActive: true,
      _roleId: userRole.id,
      _currencyId: currency.id,
    },
  });

  if (!user.slackId || !user.avatarUrl) {
    return addSlackDetailsToUser(user);
  }

  return user;
}

export async function getAllSlackUsers(): Promise<SlackUser[]> {
  const client = new WebClient(getConfig('SLACK_TOKEN'));
  const allUsers: SlackUser[] = [];
  let mutableCursor: string | undefined;
  while (true) {
    const slackResponse = await client.users
      .list({
        limit: 100,
        cursor: mutableCursor,
      })
      .catch(err => {
        return { ok: false as false, error: err };
      });

    if (!slackResponse || !slackResponse.ok) {
      throw new Error(slackResponse.error || 'There was an error!');
    }

    // tslint:disable-next-line:no-any
    const users: undefined | SlackUser[] = (slackResponse as any).members;

    if (!users) {
      throw new Error('Incorrect Slack response!');
    }

    allUsers.push(...users);

    if (slackResponse.response_metadata && slackResponse.response_metadata.next_cursor) {
      mutableCursor = slackResponse.response_metadata.next_cursor;
    } else {
      break;
    }
  }

  return allUsers;
}
