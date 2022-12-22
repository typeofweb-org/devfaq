import { Type } from "@sinclair/typebox";

export const answerSchema = Type.Object({
	id: Type.Number(),
	content: Type.String(),
});

export const updateAnswerSchema = {
	params: Type.Object({
		id: Type.Integer(),
	}),
	body: Type.Object({
		content: Type.Optional(Type.String()),
	}),
	response: {
		200: answerSchema,
	},
};

export const deleteAnswerSchema = {
	params: Type.Object({
		id: Type.Integer(),
	}),
	response: {
		200: answerSchema,
	},
};
