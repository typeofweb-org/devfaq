import type { paths } from "openapi-types";
import { serializeSource } from "./markdown";

type APIQuestion =
	paths["/questions/{id}"]["get"]["responses"][200]["content"]["application/json"]["data"];

export const serializeQuestionToMarkdown = async ({ question, ...rest }: APIQuestion) => {
	const mdxContent = await serializeSource(question);
	return { mdxContent, ...rest };
};
