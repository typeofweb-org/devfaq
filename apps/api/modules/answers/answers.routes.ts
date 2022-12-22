import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyPluginAsync } from "fastify";
import { deleteAnswerSchema, updateAnswerSchema } from "./answers.schemas.js";

const answersPlugin: FastifyPluginAsync = async (fastify) => {
	fastify.addHook("preHandler", async (request) => {
		const {
			session: { data: sessionData },
		} = request;
		const { id } = request.params as { id: number };

		if (!sessionData) {
			throw fastify.httpErrors.unauthorized();
		}

		const answer = await fastify.db.questionsAnswers.findFirst({ where: { id } });

		if (!answer) {
			throw fastify.httpErrors.notFound(`Answer with id: ${id} not found!`);
		}

		if (sessionData._user._roleId !== "admin" && answer.userId !== sessionData._user.id) {
			throw fastify.httpErrors.forbidden();
		}
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/answers/:id",
		method: "PATCH",
		schema: updateAnswerSchema,
		async handler(request) {
			const {
				params: { id },
				body: { content },
			} = request;

			return fastify.db.questionsAnswers.update({ where: { id }, data: { content } });
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/answers/:id",
		method: "DELETE",
		schema: deleteAnswerSchema,
		async handler(request) {
			const {
				params: { id },
			} = request;

			return fastify.db.questionsAnswers.delete({ where: { id } });
		},
	});
};

export default answersPlugin;
