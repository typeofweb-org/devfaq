import type { APIAnswers } from "../types";
import { serializeSource } from "./markdown";

export const serializeAnswerToMarkdown = async ({ content, ...rest }: APIAnswers[number]) => {
	const mdxContent = await serializeSource(content);
	return { mdxContent, content, ...rest };
};
