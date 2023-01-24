import { MDXRemoteSerializeResult } from "next-mdx-remote";
import Link from "next/link";
import { ReactNode } from "react";
import { Technology } from "../../lib/technologies";
import { formatDate } from "../../utils/intl";
import { Box } from "../Box";
import { MarkdownContent } from "../MarkdownContent";
import { Level } from "./QuestionLevel";

type QuestionItemProps = Readonly<{
	id: number;
	mdxContent: MDXRemoteSerializeResult;
	level: Level;
	technology: Technology;
	acceptedAt?: string;
	leftSection?: ReactNode;
	rightSection?: ReactNode;
}>;

export const QuestionItem = ({
	id,
	mdxContent,
	level,
	technology,
	acceptedAt,
	leftSection,
	rightSection,
}: QuestionItemProps) => {
	const creationDate = acceptedAt ? new Date(acceptedAt) : null;

	return (
		<Box as="article" itemType="http://schema.org/Question">
			{leftSection}
			<MarkdownContent source={mdxContent} />
			<div className="mt-1 flex min-w-max flex-col items-center md:ml-4 md:items-end">
				{rightSection}
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
		</Box>
	);
};
