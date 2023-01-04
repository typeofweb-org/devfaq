import { MDXRemoteSerializeResult } from "next-mdx-remote";
import Link from "next/link";
import { ReactNode } from "react";
import { Technology } from "../../lib/technologies";
import { formatDate } from "../../utils/intl";
import { MarkdownContent } from "../MarkdownContent";
import { Level, QuestionLevel } from "./QuestionLevel";
import { QuestionTechnology } from "./QuestionTechnology";

type QuestionItemProps = Readonly<{
	id: number;
	mdxContent: MDXRemoteSerializeResult;
	level: Level;
	technology: Technology;
	acceptedAt?: string;
	leftSection?: ReactNode;
	withTechnology?: boolean;
}>;

export const QuestionItem = ({
	id,
	mdxContent,
	level,
	technology,
	acceptedAt,
	leftSection,
	withTechnology,
}: QuestionItemProps) => {
	const creationDate = acceptedAt ? new Date(acceptedAt) : null;

	return (
		<article
			itemType="http://schema.org/Question"
			className="flex bg-white p-3 text-sm text-neutral-500 shadow-md dark:bg-white-dark dark:text-neutral-200 md:p-5"
		>
			{leftSection}
			<MarkdownContent source={mdxContent} />
			<div className="mt-1 flex min-w-max flex-col items-center md:ml-4 md:items-end">
				{withTechnology && <QuestionTechnology technology={technology} />}
				<QuestionLevel level={level} />
				<meta itemProp="keywords" content={[level, technology].join(", ")} />
				{creationDate && (
					<Link href={`/questions/p/${id}`} className="mt-3 text-xs underline">
						<time
							dateTime={creationDate.toISOString()}
							aria-label={`Pytanie dodano ${formatDate(creationDate, "long")}`}
							title={`Pytanie dodano ${formatDate(creationDate, "long")}`}
							className="hidden md:block"
							itemProp="dateCreated"
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
