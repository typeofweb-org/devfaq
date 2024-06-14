import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type TipProps = Readonly<{
	className?: string;
	children: ReactNode;
}>;

export const Tip = ({ className, children }: TipProps) => (
	<div
		className={twMerge(
			"bg-stone-200 px-5 py-4 text-sm text-neutral-900 shadow-inner dark:bg-neutral-700 dark:text-neutral-200 sm:px-14 sm:py-7",
			className,
		)}
	>
		{children}
	</div>
);
