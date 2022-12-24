import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type OpacityElementProps = {
	children: ReactNode;
	pernament?: boolean;
};

export const OpacityElement = ({ children, pernament }: OpacityElementProps) => {
	return (
		<div className={twMerge("transition", pernament ? "opacity-80" : "hover:opacity-80")}>
			{children}
		</div>
	);
};
