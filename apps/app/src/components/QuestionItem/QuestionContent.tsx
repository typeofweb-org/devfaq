"use client";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

type QuestionContentProps = Readonly<{
	source: MDXRemoteSerializeResult;
}>;

export const QuestionContent = ({ source }: QuestionContentProps) => {
	return (
		<h3 className="prism-coy grow">
			<MDXRemote {...source} />
		</h3>
	);
};
