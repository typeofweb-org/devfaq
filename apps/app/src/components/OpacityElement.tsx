import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type OpacityElementProps = {
	children: ReactNode;
	permanent?: boolean;
	className?: string;
};

export const OpacityElement = ({ children, pernament, className }: OpacityElementProps) => {
	return (
		<div
			className={twMerge("transition", pernament ? "opacity-80" : "hover:opacity-80", className)}
		>
			<>{children}</>
		</div>
	);
};
