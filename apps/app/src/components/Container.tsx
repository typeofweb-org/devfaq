import { twMerge } from "tailwind-merge";
import type { ReactNode } from "react";

type ContainerProps = Readonly<{
	className?: string;
	as?: keyof HTMLElementTagNameMap;
	id?: string;
	children: ReactNode;
}>;

export const Container = ({ className, as: As = "div", children, id }: ContainerProps) => (
	<As
		className={twMerge("mx-auto w-full max-w-full px-3 sm:max-w-5xl sm:px-11", className)}
		id={id}
	>
		{children}
	</As>
);
