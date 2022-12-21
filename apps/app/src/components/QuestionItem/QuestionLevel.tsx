import { twMerge } from "tailwind-merge";

const levelStyles = {
	junior: "bg-junior-main",
	mid: "bg-mid-main",
	senior: "bg-senior-main",
};

export type Level = keyof typeof levelStyles;

export const QuestionLevel = ({ level }: { readonly level: Level }) => (
	<span
		className={twMerge(
			"w-16 rounded-full text-center capitalize leading-8 text-white md:w-20",
			levelStyles[level],
		)}
	>
		{level}
	</span>
);
