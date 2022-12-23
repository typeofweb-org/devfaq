import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyPluginAsync } from "fastify";
import { PrismaErrorCode } from "../db/prismaErrors.js";
import { isPrismaError } from "../db/prismaErrors.util.js";
import {
	getAnswersSchema,
	createAnswerSchema,
	deleteAnswerSchema,
	updateAnswerSchema,
} from "./answers.schemas.js";

const answerSelect = { id: true, content: true } as const;

const answersPlugin: FastifyPluginAsync = async (fastify) => {
	await fastify.register(import("./answers.hooks.js"));

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/questions/:id/answers",
		method: "GET",
		schema: getAnswersSchema,
		async handler(request) {
			const {
				params: { id },
			} = request;

			const answers = await fastify.db.questionAnswer.findMany({
				where: { questionId: id },
				select: {
					CreatedBy: {
						select: { id: true, email: true, firstName: true, lastName: true, socialLogin: true },
					},
					...answerSelect,
				},
			});

			return {
				data: answers.map(({ CreatedBy: { socialLogin, ...user }, ...rest }) => ({
					user: { socialLogin: socialLogin as Record<string, string | number>, ...user },
					...rest,
				})),
			};
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/questions/:id/answers",
		method: "POST",
		schema: createAnswerSchema,
		async handler(request) {
			const {
				session: { data: sessionData },
				params: { id },
				body: { content },
			} = request;

			if (!sessionData) {
				throw fastify.httpErrors.unauthorized();
			}

			try {
				const data = await fastify.db.questionAnswer.create({
					data: { content, questionId: id, createdById: sessionData._user.id },
					select: answerSelect,
				});
				return { data };
			} catch (err) {
				if (isPrismaError(err) && err.code === PrismaErrorCode.UniqueKeyViolation) {
					throw fastify.httpErrors.conflict(
						`You have already answered on question with id: ${id}!`,
					);
				}

				throw err;
			}
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/answers/:id",
		method: "PATCH",
		schema: updateAnswerSchema,
		preHandler: fastify.preAnswerHook,
		async handler(request) {
			const {
				params: { id },
				body: { content },
			} = request;

			const data = await fastify.db.questionAnswer.update({
				where: { id },
				data: { content },
				select: answerSelect,
			});

			return { data };
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/answers/:id",
		method: "DELETE",
		schema: deleteAnswerSchema,
		preHandler: fastify.preAnswerHook,
		async handler(request) {
			const {
				params: { id },
			} = request;

			const data = await fastify.db.questionAnswer.delete({
				where: { id },
				select: answerSelect,
			});

			return { data };
		},
	});
};

export default answersPlugin;
