import Link from "next/link";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { format } from "../../../utils/intl";
import { QuestionContent } from "./QuestionContent";
import { QuestionLevel } from "./QuestionLevel";
import { QuestionVoting } from "./QuestionVoting";
import type { Level } from "./QuestionLevel";

type QuestionItemProps = Readonly<{
	id: number;
	mdxContent: MDXRemoteSerializeResult;
	level: Level;
	creationDate: Date;
	votes: number;
	voted: boolean;
	onQuestionVote: () => void;
}>;

export const QuestionItem = ({
	id,
	mdxContent,
	level,
	creationDate,
	votes,
	voted,
	onQuestionVote,
}: QuestionItemProps) => {
	return (
		<article className="flex bg-white p-5 text-sm text-neutral-500 shadow-md dark:bg-white-dark dark:text-neutral-200">
			<QuestionVoting questionId={id} votes={votes} voted={voted} onQuestionVote={onQuestionVote} />
			<QuestionContent source={mdxContent} />
			<div className="ml-4 flex min-w-max flex-col items-end">
				<QuestionLevel level={level} />
				<Link href={`/questions/p/${id}`} className="mt-3 text-xs underline">
					<time dateTime={creationDate.toISOString()}>{format(creationDate)}</time>
				</Link>
			</div>
		</article>
	);
};
