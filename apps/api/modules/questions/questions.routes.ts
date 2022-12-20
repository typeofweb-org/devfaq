import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyPluginAsync } from "fastify";
import { isPrismaError } from "../db/prismaErrors.util.js";
import { PrismaErrorCode } from "../db/prismaErrors.js";
import {
	deleteQuestionByIdSchema,
	generateGetQuestionsSchema,
	generatePatchQuestionByIdSchema,
	generatePostQuestionsSchema,
	generateGetQuestionByIdSchema,
	upvoteQuestionSchema,
	downvoteQuestionSchema,
	generateGetQuestionsVotesSchema,
	getQuestionVotesSchema,
} from "./questions.schemas.js";
import { getQuestionsPrismaParams } from "./questions.params.js";

const questionsPlugin: FastifyPluginAsync = async (fastify) => {
	await fastify.register(import("./questions.utils.js"));

	const [categories, levels, statuses] = await Promise.all([
		fastify.questionsGetCategories(),
		fastify.questionsGetLevels(),
		fastify.questionsGetStatuses(),
	]);
	const args = {
		categories,
		levels,
		statuses,
	};

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/questions",
		method: "GET",
		schema: generateGetQuestionsSchema(args),
		async handler(request, reply) {
			const params = getQuestionsPrismaParams(request.query, request.session.data?._user._roleId);

			const [total, questions] = await Promise.all([
				fastify.db.question.count({
					where: params.where,
				}),
				fastify.db.question.findMany({
					...params,
					select: {
						id: true,
						question: true,
						categoryId: true,
						levelId: true,
						statusId: true,
						acceptedAt: true,
						_count: {
							select: {
								QuestionVote: true,
							},
						},
					},
				}),
			]);

			const data = questions.map((q) => {
				return {
					id: q.id,
					question: q.question,
					_categoryId: q.categoryId,
					_levelId: q.levelId,
					_statusId: q.statusId,
					acceptedAt: q.acceptedAt?.toISOString(),
					votesCount: q._count.QuestionVote,
				};
			});

			return { data, meta: { total } };
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/questions",
		method: "POST",
		schema: generatePostQuestionsSchema(args),
		async handler(request, reply) {
			const {
				body: { question, level, category },
				session: { data: sessionData },
			} = request;

			if (!sessionData) {
				throw fastify.httpErrors.unauthorized();
			}

			try {
				const newQuestion = await fastify.db.question.create({
					data: {
						question,
						levelId: level,
						categoryId: category,
						statusId: "pending",
						createdById: sessionData._user.id,
					},
				});

				const data = {
					id: newQuestion.id,
					question: newQuestion.question,
					_categoryId: newQuestion.categoryId,
					_levelId: newQuestion.levelId,
					_statusId: newQuestion.statusId,
					acceptedAt: newQuestion.acceptedAt?.toISOString(),
					votesCount: 0,
				};

				return { data };
			} catch (err) {
				if (isPrismaError(err) && err.code === "P2002") {
					throw fastify.httpErrors.conflict(`Question with content: ${question} already exists!`);
				}

				throw err;
			}
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/questions/votes",
		method: "GET",
		schema: generateGetQuestionsVotesSchema(args),
		async handler(request, reply) {
			const params = getQuestionsPrismaParams(request.query, request.session.data?._user._roleId);

			const questions = await fastify.db.question.findMany({
				...params,
				select: {
					id: true,
					_count: {
						select: {
							QuestionVote: true,
						},
					},
					QuestionVote: {
						where: {
							userId: request.session.data?._user.id || 0,
						},
					},
				},
			});

			const data = questions.map((q) => ({
				id: q.id,
				votesCount: q._count.QuestionVote,
				currentUserVotedOn: q.QuestionVote.length > 0,
			}));

			return { data };
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/questions/:id/votes",
		method: "GET",
		schema: getQuestionVotesSchema,
		async handler(request, reply) {
			const { id } = request.params;

			const question = await fastify.db.question.findFirst({
				where: {
					id,
				},
				select: {
					id: true,
					_count: {
						select: {
							QuestionVote: true,
						},
					},
					QuestionVote: {
						where: {
							userId: request.session.data?._user.id || 0,
						},
					},
				},
			});

			if (!question) {
				throw fastify.httpErrors.notFound(`Question with id: ${id} not found!`);
			}

			return {
				data: {
					id: question.id,
					votesCount: question._count.QuestionVote,
					currentUserVotedOn: question.QuestionVote.length > 0,
				},
			};
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/questions/:id",
		method: "PATCH",
		schema: generatePatchQuestionByIdSchema(args),
		preValidation(request, reply, done) {
			if (request.session.data?._user._roleId !== "admin") {
				throw fastify.httpErrors.unauthorized();
			}
			done();
		},
		async handler(request, reply) {
			const { id } = request.params;

			const { question, level, category, status } = request.body;

			const q = await fastify.db.question.update({
				where: { id },
				data: {
					question,
					...(level && { QuestionLevel: { connect: { id: level } } }),
					...(category && { QuestionCategory: { connect: { id: category } } }),
					...(status && { QuestionStatus: { connect: { id: status } } }),
				},
				select: {
					id: true,
					question: true,
					categoryId: true,
					levelId: true,
					statusId: true,
					acceptedAt: true,
					_count: {
						select: {
							QuestionVote: true,
						},
					},
				},
			});

			const data = {
				id: q.id,
				question: q.question,
				_categoryId: q.categoryId,
				_levelId: q.levelId,
				_statusId: q.statusId,
				acceptedAt: q.acceptedAt?.toISOString(),
				votesCount: q._count.QuestionVote,
			};

			return { data };
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/questions/:id",
		method: "GET",
		schema: generateGetQuestionByIdSchema(args),
		async handler(request, reply) {
			const { id } = request.params;

			const q = await fastify.db.question.findFirst({
				where: {
					id,
					statusId: "accepted",
				},
				select: {
					id: true,
					question: true,
					categoryId: true,
					levelId: true,
					statusId: true,
					acceptedAt: true,
					_count: {
						select: {
							QuestionVote: true,
						},
					},
				},
			});

			if (!q) {
				return reply.notFound();
			}

			const data = {
				id: q.id,
				question: q.question,
				_categoryId: q.categoryId,
				_levelId: q.levelId,
				_statusId: q.statusId,
				acceptedAt: q.acceptedAt?.toISOString(),
				votesCount: q._count.QuestionVote,
			};

			return { data };
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/questions/:id",
		method: "DELETE",
		schema: deleteQuestionByIdSchema,
		preValidation(request, reply, done) {
			if (request.session.data?._user._roleId !== "admin") {
				throw fastify.httpErrors.unauthorized();
			}
			done();
		},
		async handler(request, reply) {
			const { id } = request.params;

			try {
				await fastify.db.question.delete({ where: { id } });
			} catch (err) {
				if (isPrismaError(err)) {
					switch (err.code) {
						case PrismaErrorCode.RecordRequiredButNotFound:
							throw fastify.httpErrors.notFound(`Question with id: ${id} not found!`);
					}

					throw err;
				}
			}

			return reply.status(204).send();
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/questions/:id/votes",
		method: "POST",
		schema: upvoteQuestionSchema,
		async handler(request, reply) {
			const {
				params: { id },
				session: { data: sessionData },
			} = request;

			if (!sessionData) {
				throw fastify.httpErrors.unauthorized();
			}

			try {
				const questionVote = await fastify.db.questionVote.upsert({
					where: {
						userId_questionId: {
							userId: sessionData._user.id,
							questionId: id,
						},
					},
					update: {},
					create: {
						userId: sessionData._user.id,
						questionId: id,
					},
				});

				return {
					data: {
						userId: questionVote.userId,
						questionId: questionVote.questionId,
					},
				};
			} catch (err) {
				if (isPrismaError(err)) {
					switch (err.code) {
						case PrismaErrorCode.ForeignKeyViolation:
							throw fastify.httpErrors.notFound(`Question with id: ${id} not found!`);
					}
				}

				throw err;
			}
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/questions/:id/votes",
		method: "DELETE",
		schema: downvoteQuestionSchema,
		async handler(request, reply) {
			const {
				params: { id },
				session: { data: sessionData },
			} = request;

			if (!sessionData) {
				throw fastify.httpErrors.unauthorized();
			}

			const question = await fastify.db.question.findFirst({
				where: {
					id,
				},
			});

			if (!question) {
				throw fastify.httpErrors.notFound(`Question with id: ${id} not found!`);
			}

			await fastify.db.questionVote.deleteMany({
				where: {
					userId: sessionData._user.id,
					questionId: id,
				},
			});

			return reply.status(204).send();
		},
	});
};

export default questionsPlugin;
