import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import {
	deleteQuestionByIdSchema,
	generateGetQuestionsSchema,
	generatePatchQuestionByIdSchema,
	generatePostQuestionsSchema,
	generateGetQuestionByIdSchema,
} from "./questions.schemas.js";

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
			const { category, level, status = "accepted", limit, offset, order, orderBy } = request.query;
			const levels = level?.split(",");

			const where = {
				...(category && { categoryId: category }),
				...(levels && { levelId: { in: levels } }),
				...(status && request.session.data?._user._roleId === "admin"
					? { statusId: status }
					: { statusId: "accepted" }),
			};

			// @todo also get votes
			const [total, questions] = await Promise.all([
				fastify.db.question.count({
					where,
				}),
				fastify.db.question.findMany({
					where,
					take: limit,
					skip: offset,
					...(order &&
						orderBy && {
							orderBy: {
								...(orderBy === "votesCount"
									? {
											QuestionVote: {
												_count: order,
											},
									  }
									: {
											[orderBy]: order,
									  }),
							},
						}),
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
						QuestionVote: {
							where: {
								userId: request.session.data?._user.id || 0,
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
					currentUserVotedOn: q.QuestionVote.length > 0,
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
			const { question, level, category } = request.body;

			const newQuestion = await fastify.db.question.create({
				data: {
					question,
					levelId: level,
					categoryId: category,
					statusId: "pending",
				},
			});

			const data = {
				id: newQuestion.id,
				question: newQuestion.question,
				_categoryId: newQuestion.categoryId,
				_levelId: newQuestion.levelId,
				_statusId: newQuestion.statusId,
				acceptedAt: newQuestion.acceptedAt?.toISOString(),
				currentUserVotedOn: false,
				votesCount: 0,
			};

			return { data };
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: "/questions/:id",
		method: "PATCH",
		schema: generatePatchQuestionByIdSchema(args),
		async handler(request, reply) {
			const { id } = request.params;

			const { question, level, category, status } = request.body;

			const q = await fastify.db.question.update({
				where: { id },
				data: {
					question,
					QuestionLevel: { connect: { id: level } },
					QuestionCategory: { connect: { id: category } },
					QuestionStatus: { connect: { id: status } },
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
					QuestionVote: {
						where: {
							userId: request.session.data?._user.id || 0,
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
				currentUserVotedOn: q.QuestionVote.length > 0,
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
					QuestionVote: {
						where: {
							userId: request.session.data?._user.id || 0,
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
				currentUserVotedOn: q.QuestionVote.length > 0,
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

			await fastify.db.question.delete({ where: { id } });

			return reply.status(204);
		},
	});
};

export default questionsPlugin;
