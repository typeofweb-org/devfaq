import type { paths } from "openapi-types";
import { QueryParam } from "../types";
import { serializeSource } from "./markdown";

export type APIQuestion =
	paths["/questions/{id}"]["get"]["responses"][200]["content"]["application/json"]["data"];

export const statuses = ["accepted", "pending"] as const;

export type QuestionStatus = typeof statuses[number];

export const serializeQuestionToMarkdown = async ({ question, ...rest }: APIQuestion) => {
	const mdxContent = await serializeSource(question);
	return { mdxContent, ...rest };
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
