import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";
import { meSchema } from "./auth.schemas.js";

const authRoutesPlugin: FastifyPluginAsync = async (fastify) => {
	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/auth/me",
		method: "GET",
		schema: {
			description: "Get currently logged-in user",
			tags: ["auth"],
			response: {
				200: Type.Object({ data: meSchema }),
			},
		},
		async handler(request, reply) {
			if (!request.session.data) {
				throw fastify.httpErrors.unauthorized();
			}

			return { data: request.session.data };
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/auth/me",
		method: "DELETE",
		schema: {
			description: "Log out",
			tags: ["auth"],
			response: {
				204: {},
			},
		},
		async handler(request, reply) {
			if (!request.session.data) {
				throw fastify.httpErrors.unauthorized();
			}

			await request.session.destroy();

			return reply.status(204).send();
		},
	});
};

export default authRoutesPlugin;
