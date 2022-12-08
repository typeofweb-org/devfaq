import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const variants = {
	junior: {
		notActive:
			"hover:bg-junior-light focus:shadow-[inset_0px_0px_3px_var(--junior-main-color-darker)]",
		active:
			"bg-junior-main shadow-[inset_0_2px_3px_var(--junior-main-color-darker)] hover:bg-junior-main-light hover:shadow-[inset_0_2px_3px_var(--junior-main-color-dark)] focus:shadow-[0_0_10px_var(--junior-main-color-dark),0_2px_3px_var(--junior-main-color-darker)]",
	},
	mid: {
		notActive: "hover:bg-mid-light focus:shadow-[inset_0px_0px_3px_var(--mid-main-color-darker)]",
		active:
			"bg-mid-main shadow-[inset_0_2px_3px_var(--mid-main-color-darker)] hover:bg-mid-main-light hover:shadow-[inset_0_2px_3px_var(--mid-main-color-dark)] focus:shadow-[0_0_10px_var(--mid-main-color-dark),0_2px_3px_var(--mid-main-color-darker)]",
	},
	senior: {
		notActive:
			"hover:bg-senior-light focus:shadow-[inset_0px_0px_3px_var(--senior-main-color-darker)]",
		active:
			"bg-senior-main shadow-[inset_0_2px_3px_var(--senior-main-color-darker)] hover:bg-senior-main-light hover:shadow-[inset_0_2px_3px_var(--senior-main-color-dark)] focus:shadow-[0_0_10px_var(--senior-main-color-dark),0_2px_3px_var(--senior-main-color-darker)]",
	},
};

type LevelButtonProps = Readonly<{
	variant: keyof typeof variants;
	isActive: boolean;
	children: ReactNode;
}>;

export const LevelButton = ({ variant, isActive, children }: LevelButtonProps) => {
	const { active, notActive } = variants[variant];

	return (
		<button
			className={twMerge(
				"h-20 w-20 sm:h-8 sm:w-full small-filters:h-14 small-filters:w-14",
				"rounded-md bg-white text-sm text-neutral-500 shadow-[0px_1px_4px] shadow-neutral-400 active:translate-y-px dark:text-neutral-200 dark:shadow-neutral-900",
				isActive && [active, "text-white"],
				!isActive && [notActive, "dark:bg-white-dark"],
			)}
		>
			{children}
		</button>
	);
};
