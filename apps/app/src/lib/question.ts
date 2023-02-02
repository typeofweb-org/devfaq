import type { APIQuestion, QueryParam } from "../types";
import { serializeSource } from "./markdown";

export const statuses = ["accepted", "pending"] as const;

export type QuestionStatus = typeof statuses[number];

export const serializeQuestionToMarkdown = async ({ question, ...rest }: APIQuestion) => {
	const mdxContent = await serializeSource(question);
	return { mdxContent, question, ...rest };
};

export const parseStatusQuery = (query: QueryParam | null): QuestionStatus | null => {
	if (!query) {
		return "pending";
	}

	if (typeof query !== "string" || !statuses.includes(query)) {
		return null;
	}

	return query;
};
