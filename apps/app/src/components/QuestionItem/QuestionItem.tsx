import { twMerge } from "tailwind-merge";
import { QuestionVoting } from "./QuestionVoting";

const levelStyles = {
	junior: "bg-[#499dff]",
	mid: "bg-[#27be31]",
	senior: "bg-[#ffb90b]",
};

type QuestionItemProps = Readonly<{
	title: string;
	level: keyof typeof levelStyles;
}>;

export const QuestionItem = ({ title, level }: QuestionItemProps) => (
	<article className="flex h-36 bg-white p-5 text-sm text-gray-600 shadow-md">
		<QuestionVoting votes={2} />
		<span className="grow">{title}</span>
		<div className="ml-4 flex min-w-max flex-col items-end">
			<span
				className={twMerge(
					"w-20 rounded-full text-center capitalize leading-8 text-white",
					levelStyles[level],
				)}
			>
				{level}
			</span>
			<time className="mt-3 text-xs">1 stycznia 2023</time>
		</div>
	</article>
);
