import Link from "next/link";
import { format } from "../../utils/intl";
import { serializeSource } from "../../lib/markdown";
import { QuestionLevel } from "./QuestionLevel";
import { QuestionVoting } from "./QuestionVoting";
import type { Level } from "./QuestionLevel";
import { QuestionContent } from "./QuestionContent";

type QuestionItemProps = Readonly<{
	title: string;
	votes: number;
	voted: boolean;
	level: Level;
	creationDate: Date;
}>;

export const QuestionItem = async ({
	title,
	votes,
	voted,
	level,
	creationDate,
}: QuestionItemProps) => {
	const source = await serializeSource(title);

	return (
		<article className="flex bg-white p-5 text-sm text-neutral-500 shadow-md dark:bg-white-dark dark:text-neutral-200">
			<QuestionVoting votes={votes} voted={voted} />
			<QuestionContent source={source} />
			<div className="ml-4 flex min-w-max flex-col items-end">
				<QuestionLevel level={level} />
				<Link href="#" className="mt-3 text-xs underline">
					<time dateTime={creationDate.toISOString()}>{format(creationDate)}</time>
				</Link>
			</div>
		</article>
	);
};
