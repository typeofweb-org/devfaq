import { PrismaClient } from '@prisma/client';
import type * as Fastify from 'fastify';
import ms from 'ms';
import { sessionSelect } from './auth.js';
import { dbAuthToDto } from './auth.mapper.js';

export class PrismaSessionStore {
  constructor(private readonly prisma: PrismaClient) {}

  async set(sessionId: string, session: Fastify.Session, callback: (err?: unknown) => void) {
    if (!session.data?._user) {
      return callback();
    }
    try {
      const sessionData = {
        id: sessionId,
        keepMeSignedIn: true,
        validUntil:
          session.cookie.expires || new Date(Date.now() + (session.cookie.maxAge || ms('7 days'))),
        User: { connect: { id: session.data._user.id } },
      };

      await this.prisma.session.upsert({
        where: { id: sessionId },
        create: sessionData,
        update: sessionData,
      });
      callback();
    } catch (err) {
      return callback(err);
    }
  }

  async get(sessionId: string, callback: (err?: unknown, session?: Fastify.Session) => void) {
    try {
      await this.prisma.session.deleteMany({ where: { validUntil: { lt: new Date() } } });

      const sessionDb = await this.prisma.session.findUnique({
        where: { id: sessionId },
        select: sessionSelect.select,
      });

      if (!sessionDb) {
        return callback();
      }

      const data: Fastify.Session['data'] = dbAuthToDto(sessionDb);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ?
      // @ts-ignore
      return callback(null, { data });
    } catch (err) {
      return callback(err);
    }
  }

  async destroy(sessionId: string, callback: (err?: unknown) => void) {
    try {
      await this.prisma.session.deleteMany({ where: { id: sessionId } });
      callback();
    } catch (err) {
      console.dir(err);
      return callback(err);
    }
  }
}
