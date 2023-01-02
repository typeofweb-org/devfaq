"use client";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

import "../styles/devfaq-theme.css";

type MarkdownContentProps = Readonly<{
	source: MDXRemoteSerializeResult;
}>;

export const MarkdownContent = ({ source }: MarkdownContentProps) => {
	return (
		<div
			itemProp="text"
			className="question-content prose prose-sm min-w-0 max-w-full grow px-2 prose-code:px-0 prose-pre:bg-transparent prose-pre:px-0 prose-pre:text-base dark:prose-invert md:prose-base md:prose-pre:text-base"
		>
			<MDXRemote {...source} />
		</div>
	);
};
