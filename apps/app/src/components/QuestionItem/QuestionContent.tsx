"use client";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

import "prismjs/themes/prism-coy.min.css";

type QuestionContentProps = Readonly<{
	source: MDXRemoteSerializeResult;
}>;

export const QuestionContent = ({ source }: QuestionContentProps) => {
	return (
		<div className="prism-coy prose min-w-0 max-w-full grow px-2 prose-code:px-0 prose-pre:bg-transparent prose-pre:px-0 dark:prose-invert">
			<MDXRemote {...source} />
		</div>
	);
};
