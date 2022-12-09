import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const variants = {
	junior: {
		common: "level-button-junior",
		notActive: "level-button-shadows hover:bg-junior-light",
		active: "level-button-active-shadows bg-junior-main hover:bg-junior-main-light",
	},
	mid: {
		common: "level-button-mid",
		notActive: "level-button-shadows hover:bg-mid-light",
		active: "level-button-active-shadows bg-mid-main hover:bg-mid-main-light",
	},
	senior: {
		common: "level-button-senior",
		notActive: "level-button-shadows hover:bg-senior-light",
		active: "level-button-active-shadows bg-senior-main hover:bg-senior-main-light",
	},
};

type LevelButtonProps = Readonly<{
	variant: keyof typeof variants;
	isActive: boolean;
	children: ReactNode;
}>;

export const LevelButton = ({ variant, isActive, children }: LevelButtonProps) => {
	const { common, active, notActive } = variants[variant];

	return (
		<button
			className={twMerge(
				"h-20 w-20 transition-colors duration-100 sm:h-8 sm:w-full small-filters:h-14 small-filters:w-14",
				"rounded-md bg-white text-sm text-neutral-500 active:translate-y-px dark:text-neutral-200",
				common,
				isActive && [active, "text-white"],
				!isActive && [
					notActive,
					"shadow-[0px_1px_4px] shadow-neutral-400 dark:bg-white-dark dark:shadow-neutral-900",
				],
			)}
		>
			{children}
		</button>
	);
};
