import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { useDefaultQuestionsPathname } from "../../../hooks/useDefaultQuestionsPathname";
import { useQuestionsLevels } from "../../../hooks/useQuestionsLevels";
import { LinkWithQuery } from "../../LinkWithQuery/LinkWithQuery";

type LevelFilterItemProps = Readonly<{
	variant: "junior" | "mid" | "senior";
	children: ReactNode;
}>;

export const LevelFilterItem = ({ variant, children }: LevelFilterItemProps) => {
	const { queryLevels, addLevel, removeLevel } = useQuestionsLevels();
	const { defaultPathname } = useDefaultQuestionsPathname();
	const isActive = Boolean(queryLevels.includes(variant));
	const level = !isActive ? addLevel(variant) : removeLevel(variant);

	return (
		<LinkWithQuery
			href={{
				pathname: defaultPathname,
				query: {
					level,
				},
			}}
			mergeQuery
			className={twMerge(
				"flex h-20 w-20 items-center justify-center capitalize transition-colors duration-100 sm:h-8 sm:w-full small-filters:h-14 small-filters:w-14",
				"rounded-md text-sm text-neutral-500 active:translate-y-px dark:text-neutral-200",
				!isActive &&
					"level-button bg-white shadow-[0px_1px_4px] shadow-neutral-400 dark:shadow-neutral-900",
				isActive && "level-button-active text-white",
				variant === "junior" && "level-button-junior",
				variant === "mid" && "level-button-mid",
				variant === "senior" && "level-button-senior",
			)}
			title={`Wyświetl pytania z kategorii ${variant}`}
		>
			{children}
		</LinkWithQuery>
	);
};
