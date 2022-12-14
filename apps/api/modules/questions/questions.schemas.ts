import { Type, Static } from "@sinclair/typebox";

const generateGetQuestionsQuerySchema = <
	Categories extends readonly string[],
	Levels extends readonly string[],
	Statuses extends readonly string[],
>(args: {
	categories: Categories;
	levels: Levels;
	statuses: Statuses;
}) =>
	Type.Object({
		category: Type.Optional(Type.Union(args.categories.map((val) => Type.Literal(val)))),
		status: Type.Optional(Type.Union(args.statuses.map((val) => Type.Literal(val)))),
		level: Type.Optional(Type.String({ pattern: `^([${args.levels.join("|")}],?)+$` })),
		limit: Type.Optional(Type.Integer()),
		offset: Type.Optional(Type.Integer()),
		orderBy: Type.Optional(
			Type.Union([Type.Literal("acceptedAt"), Type.Literal("levelId"), Type.Literal("votesCount")]),
		),
		order: Type.Optional(Type.Union([Type.Literal("asc"), Type.Literal("desc")])),
	});
export type GetQuestionsQuery = Static<ReturnType<typeof generateGetQuestionsQuerySchema>>;
export type GetQuestionsOrderBy = GetQuestionsQuery["orderBy"];
export type GetQuestionsOrder = GetQuestionsQuery["order"];

const generateQuestionShape = <
	Categories extends readonly string[],
	Levels extends readonly string[],
	Statuses extends readonly string[],
>(args: {
	categories: Categories;
	levels: Levels;
	statuses: Statuses;
}) => {
	return {
		id: Type.Integer(),
		question: Type.String(),
		_categoryId: Type.Union(args.categories.map((val) => Type.Literal(val))),
		_levelId: Type.Union(args.levels.map((val) => Type.Literal(val))),
		_statusId: Type.Union(args.statuses.map((val) => Type.Literal(val))),
		acceptedAt: Type.Optional(Type.String({ format: "date-time" })),
	} as const;
};

const generateCreateQuestionShape = <
	Categories extends readonly string[],
	Levels extends readonly string[],
	Statuses extends readonly string[],
>(args: {
	categories: Categories;
	levels: Levels;
	statuses: Statuses;
}) => {
	return {
		question: Type.String(),
		level: Type.Union(args.levels.map((val) => Type.Literal(val))),
		category: Type.Union(args.categories.map((val) => Type.Literal(val))),
	};
};

const generateQuestionResponseSchema = <
	Categories extends readonly string[],
	Levels extends readonly string[],
	Statuses extends readonly string[],
>(args: {
	categories: Categories;
	levels: Levels;
	statuses: Statuses;
}) =>
	Type.Object({
		...generateQuestionShape(args),
		votesCount: Type.Integer(),
	});

export const generateGetQuestionsSchema = <
	Categories extends readonly string[],
	Levels extends readonly string[],
	Statuses extends readonly string[],
>(args: {
	categories: Categories;
	levels: Levels;
	statuses: Statuses;
}) => {
	return {
		querystring: generateGetQuestionsQuerySchema(args),
		response: {
			200: Type.Object({
				data: Type.Array(generateQuestionResponseSchema(args)),
				meta: Type.Object({
					total: Type.Integer(),
				}),
			}),
		},
	} as const;
};

export const generatePostQuestionsSchema = <
	Categories extends readonly string[],
	Levels extends readonly string[],
	Statuses extends readonly string[],
>(args: {
	categories: Categories;
	levels: Levels;
	statuses: Statuses;
}) => {
	return {
		body: Type.Object(generateCreateQuestionShape(args)),
		response: {
			200: Type.Object({
				data: generateQuestionResponseSchema(args),
			}),
		},
	} as const;
};

export const generateGetQuestionsVotesSchema = <
	Categories extends readonly string[],
	Levels extends readonly string[],
	Statuses extends readonly string[],
>(args: {
	categories: Categories;
	levels: Levels;
	statuses: Statuses;
}) => {
	return {
		querystring: generateGetQuestionsQuerySchema(args),
		response: {
			200: Type.Object({
				data: Type.Array(
					Type.Object({
						id: Type.Integer(),
						votesCount: Type.Integer(),
						currentUserVotedOn: Type.Boolean(),
					}),
				),
			}),
		},
	};
};

export const generatePatchQuestionByIdSchema = <
	Categories extends readonly string[],
	Levels extends readonly string[],
	Statuses extends readonly string[],
>(args: {
	categories: Categories;
	levels: Levels;
	statuses: Statuses;
}) => {
	return {
		params: Type.Object({
			id: Type.Integer(),
		}),
		body: Type.Object({
			...generateCreateQuestionShape(args),
			status: Type.Union(args.statuses.map((val) => Type.Literal(val))),
		}),
		response: {
			200: Type.Object({
				data: generateQuestionResponseSchema(args),
			}),
		},
	};
};

export const generateGetQuestionByIdSchema = <
	Categories extends readonly string[],
	Levels extends readonly string[],
	Statuses extends readonly string[],
>(args: {
	categories: Categories;
	levels: Levels;
	statuses: Statuses;
}) => {
	return {
		params: Type.Object({
			id: Type.Integer(),
		}),
		response: {
			200: Type.Object({
				data: generateQuestionResponseSchema(args),
			}),
		},
	};
};

export const deleteQuestionByIdSchema = {
	params: Type.Object({
		id: Type.Integer(),
	}),
};

export const upvoteQuestionSchema = {
	params: Type.Object({
		id: Type.Integer(),
	}),
	response: {
		200: Type.Object({
			data: Type.Object({
				userId: Type.Integer(),
				questionId: Type.Integer(),
			}),
		}),
	},
};

export const downvoteQuestionSchema = {
	params: Type.Object({
		id: Type.Integer(),
	}),
	response: {
		204: Type.Never(),
	},
};
