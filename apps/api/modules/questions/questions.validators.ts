import { FastifyInstance } from "fastify";

export async function validateCategory(fastify: FastifyInstance, category: string | undefined) {
	const categories = await fastify.questionsGetCategories();
	if (category && !categories.includes(category)) {
		throw fastify.httpErrors.badRequest(`Invalid category: ${category}`);
	}
}

export async function validateLevels(fastify: FastifyInstance, levels: string[] | undefined) {
	const validLevels = await fastify.questionsGetLevels();
	if (levels && !levels.every((level) => validLevels.includes(level))) {
		throw fastify.httpErrors.badRequest(`Invalid levels: ${levels.join(", ")}`);
	}
}

export async function validateStatus(fastify: FastifyInstance, status: string | undefined) {
	const statuses = await fastify.questionsGetStatuses();
	if (status && !statuses.includes(status)) {
		throw fastify.httpErrors.badRequest(`Invalid status: ${status}`);
	}
}
