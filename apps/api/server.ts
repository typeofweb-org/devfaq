import Fastify from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { getConfig } from "./config/config.js";

const fastify = Fastify({
	logger:
		process.env.NODE_ENV === "production"
			? true
			: {
					transport: {
						target: "pino-pretty",
						options: {
							levelFirst: true,
							ignore: "pid,hostname",
						},
					},
			  },
	ajv: {
		customOptions: {
			strict: "log",
			keywords: ["kind", "modifier"],
		},
	},
}).withTypeProvider<TypeBoxTypeProvider>();

await fastify.register(import("@fastify/sensible"));

await fastify.register(import("./modules/db/db.js"));

await fastify.register(import("@fastify/swagger"), {
	mode: "dynamic",
	openapi: {
		info: {
			title: `DevFAQ API ${getConfig("ENV")}`,
			version: getConfig("VERSION"),
		},
	},
});
await fastify.register(import("@fastify/swagger-ui"), {
	routePrefix: "/documentation",
	uiConfig: {
		docExpansion: "full",
	},
});

await fastify.register(import("./modules/auth/auth.js"));
await fastify.register(import("./modules/questions/questions.routes.js"));

fastify.get(
	"/",
	{
		schema: {
			response: {
				200: Type.String(),
			},
		},
	},
	async () => {
		console.log(getConfig("VERSION"));
		return `Zostań na chwilę i posłuchaj`;
	},
);

export { fastify };
