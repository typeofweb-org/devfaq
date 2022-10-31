import { PrismaClient } from "@prisma/client";
import type * as Fastify from "fastify";
import ms from "ms";
import { sessionSelect } from "./auth.js";
import { dbAuthToDto } from "./auth.mapper.js";

export const defer = <A extends unknown[], T extends (...args: A) => void>(
	callback: T,
	...args: A
) => {
	setImmediate(() => {
		callback(...args);
	});
};

export class PrismaSessionStore {
	constructor(private readonly prisma: PrismaClient) {}

	async set(sessionId: string, session: Fastify.Session, callback: (err?: unknown) => void) {
		if (!session.data?._user) {
			return defer(callback);
		}
		try {
			const sessionData = {
				id: sessionId,
				keepMeSignedIn: true,
				validUntil:
					session.cookie.expires || new Date(Date.now() + (session.cookie.maxAge || ms("7 days"))),
				User: { connect: { id: session.data._user.id } },
			};

			await this.prisma.session.upsert({
				where: { id: sessionId },
				create: sessionData,
				update: sessionData,
			});
			defer(callback);
		} catch (err) {
			return defer(callback, err);
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
				return defer(callback);
			}

			const data: Fastify.Session["data"] = dbAuthToDto(sessionDb);

			return defer(callback, undefined, { data } as Fastify.Session);
		} catch (err) {
			return defer(callback, err);
		}
	}

	async destroy(sessionId: string, callback: (err?: unknown) => void) {
		try {
			await this.prisma.session.deleteMany({ where: { id: sessionId } });
			defer(callback);
		} catch (err) {
			console.dir(err);
			return defer(callback, err);
		}
	}
}
