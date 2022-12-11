import Link from "next/link";
import { format } from "../../utils/intl";
import { QuestionLevel } from "./QuestionLevel";
import { QuestionVoting } from "./QuestionVoting";
import type { Level } from "./QuestionLevel";

type QuestionItemProps = Readonly<{
	title: string;
	votes: number;
	voted: boolean;
	level: Level;
	creationDate: Date;
}>;

export const QuestionItem = ({ title, votes, voted, level, creationDate }: QuestionItemProps) => (
	<article className="flex bg-white p-5 text-sm text-neutral-500 shadow-md dark:bg-white-dark dark:text-neutral-200">
		<QuestionVoting votes={votes} voted={voted} />
		<h3 className="grow">{title}</h3>
		<div className="ml-4 flex min-w-max flex-col items-end">
			<QuestionLevel level={level} />
			<Link href="#" className="mt-3 text-xs underline">
				<time dateTime={creationDate.toISOString()}>{format(creationDate)}</time>
			</Link>
		</div>
	</article>
);
