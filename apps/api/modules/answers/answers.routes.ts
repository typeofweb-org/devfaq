import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Prisma } from "@prisma/client";
import { FastifyPluginAsync, preHandlerAsyncHookHandler, preHandlerHookHandler } from "fastify";
import { PrismaErrorCode } from "../db/prismaErrors.js";
import { isPrismaError } from "../db/prismaErrors.util.js";
import { dbAnswerToDto } from "./answers.mapper.js";
import { getAnswersPrismaParams } from "./answers.params.js";
import {
	getAnswersRelatedToPostSchema,
	createAnswerSchema,
	deleteAnswerSchema,
	updateAnswerSchema,
	upvoteAnswerSchema,
	getAnswersSchema,
} from "./answers.schemas.js";

export const answerSelect = (userId: number) => {
	return {
		id: true,
		content: true,
		sources: true,
		createdAt: true,
		CreatedBy: {
			select: { id: true, firstName: true, lastName: true, socialLogin: true },
		},
		_count: {
			select: {
				QuestionAnswerVote: true,
			},
		},
		QuestionAnswerVote: {
			where: {
				userId: userId,
			},
		},
	} satisfies Prisma.QuestionAnswerSelect;
};

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
		url: "/answers",
		method: "GET",
		schema: getAnswersSchema,
		async handler(request) {
			const params = getAnswersPrismaParams(request.query);
			const answers = await fastify.db.questionAnswer.findMany({
				...params,
				select: {
					id: true,
					content: true,
					sources: true,
					createdAt: true,
					updatedAt: true,
					CreatedBy: {
						select: { id: true, firstName: true, lastName: true, socialLogin: true },
					},
					_count: {
						select: {
							QuestionAnswerVote: true,
						},
					},
				},
			});

			return {
				data: answers.map((a) => {
					return {
						id: a.id,
						content: a.content,
						sources: a.sources,
						createdAt: a.createdAt.toISOString(),
						updatedAt: a.createdAt.toISOString(),
						createdBy: {
							id: a.CreatedBy.id,
							firstName: a.CreatedBy.firstName,
							lastName: a.CreatedBy.lastName,
							socialLogin: a.CreatedBy.socialLogin as Record<string, string | number>,
						},
						votesCount: a._count.QuestionAnswerVote,
					};
				}),
			};
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/questions/:id/answers",
		method: "GET",
		schema: getAnswersRelatedToPostSchema,
		async handler(request) {
			const {
				params: { id },
				session: { data: sessionData },
			} = request;

			const answers = await fastify.db.questionAnswer.findMany({
				where: { questionId: id },
				select: answerSelect(request.session.data?._user.id || 0),
			});

			return {
				data: answers.map((answer) => dbAnswerToDto(answer)),
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
					select: answerSelect(request.session.data?._user.id || 0),
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
				session: { data: sessionData },
			} = request;

			const answer = await fastify.db.questionAnswer.update({
				where: { id },
				data: { content, sources },
				select: answerSelect(request.session.data?._user.id || 0),
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

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/answers/:id/votes",
		method: "POST",
		schema: upvoteAnswerSchema,
		async handler(request, reply) {
			const {
				params: { id },
				session: { data: sessionData },
			} = request;

			if (!sessionData) {
				throw fastify.httpErrors.unauthorized();
			}

			try {
				const questionAnswerVote = await fastify.db.questionAnswerVote.upsert({
					where: {
						userId_questionAnswerId: {
							userId: sessionData._user.id,
							questionAnswerId: id,
						},
					},
					create: {
						userId: sessionData._user.id,
						questionAnswerId: id,
					},
					update: {
						userId: sessionData._user.id,
						questionAnswerId: id,
					},
				});

				return {
					data: {
						userId: sessionData._user.id,
						answerId: id,
					},
				};
			} catch (err) {
				if (isPrismaError(err) && PrismaErrorCode.ForeignKeyViolation) {
					throw fastify.httpErrors.notFound(`Answer vote with id: ${id} not found!`);
				}

				throw err;
			}
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/answers/:id/votes",
		method: "DELETE",
		schema: deleteAnswerSchema,
		async handler(request, reply) {
			const {
				params: { id },
				session: { data: sessionData },
			} = request;

			if (!sessionData) {
				throw fastify.httpErrors.unauthorized();
			}

			const questionAnswer = await fastify.db.questionAnswer.findFirst({
				where: {
					id,
				},
			});

			if (!questionAnswer) {
				throw fastify.httpErrors.notFound(`Answer vote with id: ${id} not found!`);
			}

			await fastify.db.questionAnswerVote.deleteMany({
				where: {
					userId: sessionData._user.id,
					questionAnswerId: id,
				},
			});

			return reply.status(204).send();
		},
	});
};

export default answersPlugin;
