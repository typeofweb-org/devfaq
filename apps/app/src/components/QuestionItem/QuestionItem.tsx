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
	<article className="flex h-36 bg-white p-5 text-sm text-gray-500 shadow-md">
		<QuestionVoting votes={votes} voted={voted} />
		<h1 className="grow">{title}</h1>
		<div className="ml-4 flex min-w-max flex-col items-end">
			<QuestionLevel level={level} />
			<Link href="#" className="mt-3 text-xs underline">
				<time dateTime={creationDate.toISOString()}>{format(creationDate)}</time>
			</Link>
		</div>
	</article>
);
``;
