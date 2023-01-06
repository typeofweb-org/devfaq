import { twMerge } from "tailwind-merge";

type BoxProps = JSX.IntrinsicElements["div"] & {
	as?: "div" | "article";
};
export const Box = ({ as: El = "div", className, ...props }: BoxProps) => {
	return (
		<El
			{...props}
			className={twMerge(
				`flex bg-white p-3 text-sm text-neutral-500 shadow-md dark:bg-white-dark dark:text-neutral-200 md:p-5`,
				className,
			)}
		/>
	);
};
