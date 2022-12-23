import { FastifyPluginAsync, preHandlerHookHandler } from "fastify";
import FP from "fastify-plugin";

declare module "fastify" {
	interface FastifyInstance {
		preAnswerHook: preHandlerHookHandler;
	}
}

const answersHooks: FastifyPluginAsync = async (fastify) => {
	fastify.decorate<preHandlerHookHandler>("preAnswerHook", async (request) => {
		const {
			session: { data: sessionData },
		} = request;
		const { id } = request.params as { id: number };

		if (!sessionData) {
			throw fastify.httpErrors.unauthorized();
		}

		const answer = await fastify.db.questionAnswer.findFirst({
			where: { id },
			select: { createdById: true },
		});

		if (!answer) {
			throw fastify.httpErrors.notFound(`Answer with id: ${id} not found!`);
		}

		if (sessionData._user._roleId !== "admin" && answer.createdById !== sessionData._user.id) {
			throw fastify.httpErrors.forbidden();
		}
	});
};

export default FP(answersHooks);
