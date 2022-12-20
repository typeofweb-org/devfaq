import { MDXRemoteSerializeResult } from "next-mdx-remote";
import Link from "next/link";
import { ReactNode } from "react";
import { format } from "../../utils/intl";
import { QuestionContent } from "./QuestionContent";
import { Level, QuestionLevel } from "./QuestionLevel";

type QuestionProps = Readonly<{
	id: number;
	mdxContent: MDXRemoteSerializeResult;
	level: Level;
	acceptedAt?: string;
	leftSection?: ReactNode;
}>;

export const Question = ({ id, mdxContent, level, acceptedAt, leftSection }: QuestionProps) => {
	const creationDate = acceptedAt ? new Date(acceptedAt) : null;

	return (
		<article className="flex items-center bg-white p-5 text-sm text-neutral-500 shadow-md dark:bg-white-dark dark:text-neutral-200">
			{leftSection}
			<QuestionContent source={mdxContent} />
			<div className="ml-4 flex min-w-max flex-col items-end">
				<QuestionLevel level={level} />
				{creationDate && (
					<Link href={`/questions/p/${id}`} className="mt-3 text-xs underline">
						<time dateTime={creationDate.toISOString()}>{format(creationDate)}</time>
					</Link>
				)}
			</div>
		</article>
	);
};
