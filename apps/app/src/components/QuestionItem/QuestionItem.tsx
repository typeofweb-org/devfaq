import Link from "next/link";
import { QuestionLevel } from "./QuestionLevel";
import { QuestionVoting } from "./QuestionVoting";
import type { Level } from "./QuestionLevel";

type QuestionItemProps = Readonly<{
	title: string;
	votes: number;
	isVoted: boolean;
	level: Level;
	creationDate: string;
}>;

export const QuestionItem = ({ title, votes, isVoted, level, creationDate }: QuestionItemProps) => {
	const date = new Date(creationDate);
	const localeDate = date.toLocaleDateString("pl-PL", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	return (
		<article className="flex h-36 bg-white p-5 text-sm text-gray-500 shadow-md">
			<QuestionVoting votes={votes} isVoted={isVoted} />
			<h1 className="grow">{title}</h1>
			<div className="ml-4 flex min-w-max flex-col items-end">
				<QuestionLevel level={level} />
				<Link href="#" className="mt-3 text-xs underline">
					<time dateTime={date.toISOString()}>{localeDate}</time>
				</Link>
			</div>
		</article>
	);
};
