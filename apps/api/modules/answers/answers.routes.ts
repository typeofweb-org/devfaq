import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Prisma } from "@prisma/client";
import { FastifyPluginAsync, preHandlerAsyncHookHandler, preHandlerHookHandler } from "fastify";
import { PrismaErrorCode } from "../db/prismaErrors.js";
import { isPrismaError } from "../db/prismaErrors.util.js";
import { dbAnswerToDto } from "./answers.mapper.js";
import {
	getAnswersSchema,
	createAnswerSchema,
	deleteAnswerSchema,
	updateAnswerSchema,
} from "./answers.schemas.js";

export const answerSelect = {
	id: true,
	content: true,
	sources: true,
	createdAt: true,
	CreatedBy: {
		select: { id: true, firstName: true, lastName: true, socialLogin: true },
	},
} satisfies Prisma.QuestionAnswerSelect;

const answersPlugin: FastifyPluginAsync = async (fastify) => {
	const checkAnswerUserHook: preHandlerAsyncHookHandler = async (request) => {
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
	};

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
				select: answerSelect,
			});

			return {
				data: answers.map(dbAnswerToDto),
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
				body: { content, sources },
			} = request;

			if (!sessionData) {
				throw fastify.httpErrors.unauthorized();
			}

			try {
				const answer = await fastify.db.questionAnswer.create({
					data: { questionId: id, createdById: sessionData._user.id, content, sources },
					select: answerSelect,
				});

				return { data: dbAnswerToDto(answer) };
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
		preHandler: checkAnswerUserHook as preHandlerHookHandler,
		async handler(request) {
			const {
				params: { id },
				body: { content, sources },
			} = request;

			const answer = await fastify.db.questionAnswer.update({
				where: { id },
				data: { content, sources },
				select: answerSelect,
			});

			return { data: dbAnswerToDto(answer) };
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/answers/:id",
		method: "DELETE",
		schema: deleteAnswerSchema,
		preHandler: checkAnswerUserHook as preHandlerHookHandler,
		async handler(request, reply) {
			const {
				params: { id },
			} = request;

			await fastify.db.questionAnswer.delete({
				where: { id },
			});

			return reply.status(204).send();
		},
	});
};

export default answersPlugin;
