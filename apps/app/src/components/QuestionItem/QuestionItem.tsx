import { MDXRemoteSerializeResult } from "next-mdx-remote";
import Link from "next/link";
import { ReactNode } from "react";
import { formatDate } from "../../utils/intl";
import { MarkDownContent } from "../MarkDownContent";
import { Level, QuestionLevel } from "./QuestionLevel";

type QuestionItemProps = Readonly<{
	id: number;
	mdxContent: MDXRemoteSerializeResult;
	level: Level;
	acceptedAt?: string;
	leftSection?: ReactNode;
}>;

export const QuestionItem = ({
	id,
	mdxContent,
	level,
	acceptedAt,
	leftSection,
}: QuestionItemProps) => {
	const creationDate = acceptedAt ? new Date(acceptedAt) : null;

	return (
		<article className="flex bg-white p-3 text-sm text-neutral-500 shadow-md dark:bg-white-dark dark:text-neutral-200 md:p-5">
			{leftSection}
			<MarkDownContent source={mdxContent} />
			<div className="mt-1 flex min-w-max flex-col items-center md:ml-4 md:items-end">
				<QuestionLevel level={level} />
				{creationDate && (
					<Link href={`/questions/p/${id}`} className="mt-3 text-xs underline">
						<time
							dateTime={creationDate.toISOString()}
							aria-label={`Pytanie dodano ${formatDate(creationDate, "long")}`}
							title={`Pytanie dodano ${formatDate(creationDate, "long")}`}
							className="hidden md:block"
						>
							{formatDate(creationDate, "long")}
						</time>
						<time
							dateTime={creationDate.toISOString()}
							aria-label={`Pytanie dodano ${formatDate(creationDate, "long")}`}
							title={`Pytanie dodano ${formatDate(creationDate, "long")}`}
							className="block md:hidden"
						>
							{formatDate(creationDate, "short")}
						</time>
					</Link>
				)}
			</div>
		</article>
	);
};
