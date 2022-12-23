import { Type } from "@sinclair/typebox";

const answerSchema = Type.Object({
	id: Type.Number(),
	content: Type.String(),
});

export const getAnswersSchema = {
	params: Type.Object({
		id: Type.Integer(),
	}),
	response: {
		200: Type.Object({
			data: Type.Array(
				Type.Intersect([
					answerSchema,
					Type.Object({
						user: Type.Object({
							id: Type.Integer(),
							email: Type.String(),
							firstName: Type.Union([Type.String(), Type.Null()]),
							lastName: Type.Union([Type.String(), Type.Null()]),
							socialLogin: Type.Record(Type.String(), Type.Union([Type.String(), Type.Number()])),
						}),
					}),
				]),
			),
		}),
	},
};

export const createAnswerSchema = {
	params: Type.Object({
		id: Type.Integer(),
	}),
	body: Type.Object({
		content: Type.String(),
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
	body: Type.Object({
		content: Type.Optional(Type.String()),
	}),
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
		200: Type.Object({
			data: answerSchema,
		}),
	},
};
