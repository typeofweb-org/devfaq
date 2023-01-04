import { randomUUID } from "crypto";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import FastifyOauth, { OAuth2Namespace, OAuth2Token } from "@fastify/oauth2";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { fetch } from "undici";
import ms from "ms";
import { getConfig } from "../../config/config.js";
import { GitHubUser } from "./githubProfile.type.js";
import { userSelect } from "./auth.js";
import { dbAuthToDto } from "./auth.mapper.js";

declare module "fastify" {
	interface FastifyInstance {
		githubOAuth2: OAuth2Namespace;
	}
}

const authRoutesPlugin: FastifyPluginAsync = async (fastify) => {
	const protocol = getConfig("ENV") === "development" ? "http" : "https";
	const subdomain = getConfig("ENV") === "staging" ? "staging-api" : "api";
	const domain = getConfig("COOKIE_DOMAIN");
	const port = getConfig("ENV") === "development" ? `:${getConfig("PORT")}` : "";
	const callbackUri = `${protocol}://${subdomain}.${domain}${port}/oauth/github`;

	await fastify.register(FastifyOauth, {
		name: "githubOAuth2",
		credentials: {
			client: {
				id: getConfig("GITHUB_CLIENT_ID"),
				secret: getConfig("GITHUB_CLIENT_SECRET"),
			},
			auth: FastifyOauth.GITHUB_CONFIGURATION,
		},
		scope: ["user"],
		schema: {
			tags: ["auth"],
		},
		startRedirectPath: "/oauth/github/login",
		callbackUri,
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/oauth/github",
		method: "GET",
		async handler(request, reply) {
			const gitHubCredentials = await fastify.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(
				request,
			);

			const [{ primaryEmail }, { user }] = await Promise.all([
				getGitHubPrimaryEmail(fastify, gitHubCredentials),
				getGitHubProfile(fastify, gitHubCredentials),
			]);

			const { firstName, lastName } = getName(user);

			const result = {
				externalServiceId: user.id,
				email: primaryEmail.email,
				firstName,
				lastName,
			};

			const userAccount = await findOrCreateAccountFor(fastify, result);

			const socialLogin = validateSocialLogin(userAccount.socialLogin)
				? userAccount.socialLogin
				: null;

			await request.session.regenerate();
			request.session.data = dbAuthToDto({
				id: randomUUID(),
				validUntil: new Date(Date.now() + ms("7 days")),
				keepMeSignedIn: true,
				createdAt: new Date(),
				updatedAt: new Date(),
				User: { ...userAccount, socialLogin },
			});

			// this is a hack to close the popup initiated on the frontend
			return reply.header("content-type", "text/html").send(
				`
<!doctype>
<html>
  <script>window.close();</script>
</html>
        `.trim(),
			);
		},
	});
};

export default authRoutesPlugin;

async function getGitHubProfile(fastify: FastifyInstance, gitHubCredentials: OAuth2Token) {
	const res = await fetch("https://api.github.com/user", {
		headers: {
			Authorization: `token ${gitHubCredentials.token.access_token}`,
		},
	});

	if (!res.ok) {
		throw fastify.httpErrors.serviceUnavailable(`GitHub responded with an error!`);
	}

	const user = (await res.json()) as GitHubUser;

	return { user };
}

async function getGitHubPrimaryEmail(fastify: FastifyInstance, gitHubCredentials: OAuth2Token) {
	const res = await fetch("https://api.github.com/user/emails", {
		headers: {
			Authorization: `token ${gitHubCredentials.token.access_token}`,
		},
	});

	if (!res.ok) {
		throw fastify.httpErrors.serviceUnavailable(`GitHub responded with an error!`);
	}

	const emails = (await res.json()) as Array<{
		email: string;
		primary: boolean;
		verified: boolean;
		visibility: unknown;
	}>;
	const primaryEmail = emails.find((e) => e.primary && e.verified);

	if (!primaryEmail) {
		throw fastify.httpErrors.unauthorized("Your primary email is not verified!");
	}
	return { primaryEmail, emails };
}

function getName(gitHubUser: GitHubUser) {
	const [firstName = "", ...rest] = (gitHubUser.name ?? "").split(" ");
	return {
		firstName,
		lastName: rest.join(" "),
	};
}

async function findOrCreateAccountFor(
	fastify: FastifyInstance,
	{ externalServiceId, email, firstName, lastName }: AuthDetails,
) {
	const dbUser = await fastify.db.user.findFirst({
		where: { socialLogin: { equals: { github: externalServiceId } } },
		select: userSelect.select,
	});

	if (dbUser) {
		return dbUser;
	}

	const dbUserByEmail = await fastify.db.user.findFirst({ where: { email } });
	if (dbUserByEmail) {
		// @todo merge accounts
		throw fastify.httpErrors.conflict("User with provided email already exists!");
	}

	const newDbUser = await fastify.db.user.create({
		data: {
			email,
			socialLogin: { github: externalServiceId },
			firstName,
			lastName,
		},
		select: userSelect.select,
	});

	return newDbUser;
}

const validateSocialLogin = (sl: unknown): sl is Record<string, string | number> => {
	if (sl === null || sl === undefined || typeof sl !== "object" || Array.isArray(sl)) {
		return false;
	}
	return Object.values(sl).every((val) => typeof val === "string" || typeof val === "number");
};

type AuthDetails = {
	externalServiceId: number;
	email: string;
	firstName: string;
	lastName: string;
};
