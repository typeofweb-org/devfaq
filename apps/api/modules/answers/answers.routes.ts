import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Prisma } from "@prisma/client";
import { FastifyPluginAsync, preHandlerAsyncHookHandler, preHandlerHookHandler } from "fastify";
import { revalidate } from "../../services/revalidation.service.js";
import { PrismaErrorCode } from "../db/prismaErrors.js";
import { isPrismaError } from "../db/prismaErrors.util.js";
import { dbAnswerToDto } from "./answers.mapper.js";
import {
	getAnswersSchema,
	createAnswerSchema,
	deleteAnswerSchema,
	updateAnswerSchema,
	upvoteAnswerSchema,
} from "./answers.schemas.js";

export const answerSelect = (userId: number) => {
	return {
		id: true,
		questionId: true,
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

const revalidateQuestion = (id: number) => revalidate(`/questions/p/${id}`);

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

				await revalidateQuestion(id);

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

			await revalidateQuestion(answer.questionId);

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

			const { questionId } = await fastify.db.questionAnswer.delete({
				where: { id },
			});

			await revalidateQuestion(questionId);

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
