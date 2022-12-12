import { twMerge } from "tailwind-merge";
import type { SelectHTMLAttributes } from "react";

const variants = {
	default: "select bg-white py-1 pl-1 pr-6 text-neutral-700",
	purple:
		"select-purple border-b border-primary bg-transparent py-2 pr-6 pl-1 capitalize text-primary transition-shadow duration-100 focus:shadow-[0_0_10px] focus:shadow-primary dark:border-neutral-200 dark:text-neutral-200 dark:focus:shadow-white",
};

type SelectProps = Readonly<{
	variant: keyof typeof variants;
}> &
	SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({ variant, className, ...props }: SelectProps) => (
	<select
		className={twMerge(
			"cursor-pointer appearance-none rounded-none text-base focus:outline-0",
			variants[variant],
			className,
		)}
		{...props}
	/>
);
