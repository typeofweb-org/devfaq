import { twMerge } from "tailwind-merge";
import type { SelectHTMLAttributes } from "react";

export const Select = ({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
	<select
		className={twMerge(
			"select-purple cursor-pointer appearance-none rounded-none border-b border-primary bg-transparent py-2 pr-6 pl-1 text-base capitalize text-primary transition-shadow duration-100 focus:shadow-[0_0_10px] focus:shadow-primary focus:outline-0 dark:border-neutral-200 dark:text-neutral-200 dark:focus:shadow-white",
			className,
		)}
		{...props}
	/>
);
