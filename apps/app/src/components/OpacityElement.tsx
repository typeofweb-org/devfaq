import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type OpacityElementProps = {
	children: ReactNode;
	className?: string;
};

export const OpacityElement = ({ children, className }: OpacityElementProps) => {
	return (
		<div className={twMerge("transition hover:opacity-80", className)}>
			<>{children}</>
		</div>
	);
};
