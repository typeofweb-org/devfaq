import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const variants = {
	alert: "text-white font-bold bg-red-branding hover:bg-red-branding-dark disabled:bg-[#bfbfbf]",
	branding:
		"text-violet-700 border-violet-700 bg-transparent hover:bg-violet-50 focus:shadow-[0_0_10px] focus:shadow-violet-700",
	brandingInverse:
		"text-white border-white bg-violet-700 hover:bg-violet-200 focus:shadow-[0_0_10px] focus:shadow-white",
	alternative:
		"text-white border-white bg-yellow-branding hover:bg-yellow-branding-dark focus:shadow-[0_0_10px] focus:shadow-yellow-branding",
};

type ButtonProps = Readonly<{
	variant: keyof typeof variants;
}> &
	ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ variant, className, ...props }: ButtonProps) => (
	<button
		className={twMerge(
			"min-w-[160px] rounded-md border border-transparent px-8 py-1 text-sm leading-8 transition-colors duration-100 sm:py-0",
			variants[variant],
			className,
		)}
		{...props}
	/>
);
