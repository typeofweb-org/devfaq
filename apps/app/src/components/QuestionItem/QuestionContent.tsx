"use client";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

import "prismjs/themes/prism-coy.min.css";

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
