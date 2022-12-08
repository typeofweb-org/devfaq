import { twMerge } from "tailwind-merge";
import { ButtonHTMLAttributes } from "react";

export const CloseButton = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
	<button
		className={twMerge(
			"h-8 w-8 appearance-none rounded-full p-0 text-4xl leading-7 text-violet-200 transition-colors duration-100 hover:bg-primary focus:shadow-[0_0_10px] focus:shadow-primary focus:outline-none",
			className,
		)}
		{...props}
	>
		&times;
	</button>
);
