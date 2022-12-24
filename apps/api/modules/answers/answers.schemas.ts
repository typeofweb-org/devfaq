import { Type } from "@sinclair/typebox";

const answerSchema = Type.Object({
	id: Type.Number(),
	content: Type.String(),
	sources: Type.Array(Type.String()),
	createdAt: Type.String({ format: "date-time" }),
	votesCount: Type.Integer(),
	currentUserVotedOn: Type.Boolean(),
	createdBy: Type.Object({
		id: Type.Integer(),
		firstName: Type.Union([Type.String(), Type.Null()]),
		lastName: Type.Union([Type.String(), Type.Null()]),
		socialLogin: Type.Record(Type.String(), Type.Union([Type.String(), Type.Number()])),
	}),
});

export const getAnswersSchema = {
	params: Type.Object({
		id: Type.Integer(),
	}),
	response: {
		200: Type.Object({
			data: Type.Array(answerSchema),
		}),
	},
};

export const createAnswerSchema = {
	params: Type.Object({
		id: Type.Integer(),
	}),
	body: Type.Object({
		content: Type.String(),
		sources: Type.Array(Type.String()),
	}),
	response: {
		200: Type.Object({
			data: answerSchema,
		}),
	},
};

export const updateAnswerSchema = {
	params: Type.Object({
		id: Type.Integer(),
	}),
	body: Type.Partial(
		Type.Object({
			content: Type.String(),
			sources: Type.Array(Type.String()),
		}),
	),
	response: {
		200: Type.Object({
			data: answerSchema,
		}),
	},
};

export const deleteAnswerSchema = {
	params: Type.Object({
		id: Type.Integer(),
	}),
	response: {
		204: Type.Never(),
	},
};

export const upvoteAnswerSchema = {
	params: Type.Object({
		id: Type.Integer(),
	}),
	response: {
		200: Type.Object({
			data: Type.Object({
				userId: Type.Integer(),
				answerId: Type.Integer(),
			}),
		}),
	},
};

export const downvoteAnswerSchema = {
	params: Type.Object({
		id: Type.Integer(),
	}),
	response: {
		204: Type.Never(),
	},
};
