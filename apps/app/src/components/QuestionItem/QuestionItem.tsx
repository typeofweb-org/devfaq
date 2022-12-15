import Link from "next/link";
import { format } from "../../utils/intl";
import { QuestionFilter } from "../../types";
import { QuestionLevel } from "./QuestionLevel";
import { QuestionVoting } from "./QuestionVoting";
import type { Level } from "./QuestionLevel";

type QuestionItemProps = Readonly<{
	id: number;
	title: string;
	level: Level;
	creationDate: Date;
	questionFilter: QuestionFilter;
}>;

export const QuestionItem = ({
	id,
	title,
	level,
	creationDate,
	questionFilter,
}: QuestionItemProps) => (
	<article className="flex bg-white p-5 text-sm text-neutral-500 shadow-md dark:bg-white-dark dark:text-neutral-200">
		<QuestionVoting questionId={id} questionFilter={questionFilter} />
		<h3 className="grow">{title}</h3>
		<div className="ml-4 flex min-w-max flex-col items-end">
			<QuestionLevel level={level} />
			<Link href="#" className="mt-3 text-xs underline">
				<time dateTime={creationDate.toISOString()}>{format(creationDate)}</time>
			</Link>
		</div>
	</article>
);
