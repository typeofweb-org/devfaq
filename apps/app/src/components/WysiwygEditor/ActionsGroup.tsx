import { twMerge } from "tailwind-merge";
import type { ReactNode } from "react";

type ActionsGroupProps = Readonly<{
	separator?: boolean;
	children: ReactNode;
}>;

export const ActionsGroup = ({ separator = true, children }: ActionsGroupProps) => {
	return (
		<div
			className={twMerge("flex gap-x-1 pr-1.5", separator && "border-l border-neutral-300 pl-1.5")}
		>
			{children}
		</div>
	);
};
