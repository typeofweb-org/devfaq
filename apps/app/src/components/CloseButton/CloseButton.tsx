import { twMerge } from "tailwind-merge";
import { ButtonHTMLAttributes } from "react";

export const CloseButton = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
	<button
		className={twMerge(
			"flex h-8 w-8 appearance-none items-center justify-center rounded-full text-4xl text-violet-200 transition-colors duration-100 hover:bg-primary hover:text-white focus:shadow-[0_0_10px] focus:shadow-primary focus:outline-none dark:hover:bg-violet-700",
			className,
		)}
		{...props}
	>
		&times;
	</button>
);
