import { use } from "react";
import { serializeSource } from "../../../lib/markdown";
import { QuestionContent } from "../../QuestionsList/QuestionItem/QuestionContent";

export const QuestionPreview = ({ content }: { readonly content: string }) => {
	const source = use(serializeSource(content));

	return <QuestionContent source={source} />;
};
