import { getConfig } from "./config/config.js";
import { fastify } from "./server.js";

const start = async () => {
	try {
		await fastify.listen({ port: getConfig("PORT"), host: "0.0.0.0" });
		console.log({
			NODE_ENV: process.env.NODE_ENV,
			ENV: process.env.ENV,
		});
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start().catch((err) => {
	console.error(err);
	process.exit(1);
});
