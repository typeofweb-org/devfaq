import type FastifySessionPlugin from "@fastify/session";
import { Prisma } from "@prisma/client";
import type { FastifyPluginAsync } from "fastify";
import FP from "fastify-plugin";
import ms from "ms";
import { getConfig } from "../../config/config.js";
import { MeSchema } from "./auth.schemas.js";
import { PrismaSessionStore } from "./prismaSessionStore.js";

declare module "fastify" {
	interface FastifyInstance {}

	interface Session {
		data?: MeSchema & { id: string };
	}
}

export const userSelect = Prisma.validator<Prisma.UserArgs>()({
	select: {
		id: true,
		email: true,
		firstName: true,
		lastName: true,
		socialLogin: true,
		createdAt: true,
		updatedAt: true,
		UserRole: {
			select: {
				id: true,
			},
		},
	},
});

export const sessionSelect = Prisma.validator<Prisma.SessionArgs>()({
	select: {
		id: true,
		validUntil: true,
		keepMeSignedIn: true,
		createdAt: true,
		updatedAt: true,
		User: userSelect,
	},
});

const auth: FastifyPluginAsync = async (fastify, options) => {
	const sessionStore = new PrismaSessionStore(fastify.db);

	await fastify.register(import("@fastify/cookie"));
	await fastify.register(import("@fastify/session"), {
		cookieName: "session",
		secret: getConfig("COOKIE_PASSWORD"),
		store: sessionStore as FastifySessionPlugin.SessionStore,
		rolling: true,
		cookie: {
			sameSite: "lax",
			httpOnly: true,
			secure: getConfig("NODE_ENV") === "production",
			domain: getConfig("COOKIE_DOMAIN"),
			maxAge: ms("7 days"),
		},
	});

	await fastify.register(import("./githubAuth.js"));
	await fastify.register(import("./auth.routes.js"));
};

const authPlugin = FP(auth);

export default authPlugin;
