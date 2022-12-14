import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type LevelButtonProps = Readonly<{
	variant: "junior" | "mid" | "senior";
	isActive: boolean;
	onClick?: () => void;
	children: ReactNode;
}>;

export const LevelButton = ({ variant, isActive, onClick, children }: LevelButtonProps) => (
	<button
		className={twMerge(
			"h-20 w-20 capitalize transition-colors duration-100 sm:h-8 sm:w-full small-filters:h-14 small-filters:w-14",
			"rounded-md text-sm text-neutral-500 active:translate-y-px dark:text-neutral-200",
			!isActive &&
				"level-button bg-white shadow-[0px_1px_4px] shadow-neutral-400 dark:shadow-neutral-900",
			isActive && "level-button-active text-white",
			variant === "junior" && "level-button-junior",
			variant === "mid" && "level-button-mid",
			variant === "senior" && "level-button-senior",
		)}
		onClick={onClick}
	>
		{children}
	</button>
);
