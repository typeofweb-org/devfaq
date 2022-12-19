import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { use } from "react";
import { serializeSource } from "../../../lib/markdown";

export const QuestionPreview = ({ content }: { readonly content: string }) => {
	const source = use(serializeSource(content));

	return <MDXRemote {...source} />;
};
