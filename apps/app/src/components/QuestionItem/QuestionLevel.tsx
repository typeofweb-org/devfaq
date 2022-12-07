import { twMerge } from "tailwind-merge";

const levelStyles = {
	junior: "bg-[#499dff]",
	mid: "bg-[#27be31]",
	senior: "bg-[#ffb90b]",
};

export type Level = keyof typeof levelStyles;

export const QuestionLevel = ({ level }: { readonly level: Level }) => (
	<span
		className={twMerge(
			"w-20 rounded-full text-center capitalize leading-8 text-white",
			levelStyles[level],
		)}
	>
		{level}
	</span>
);
