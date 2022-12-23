import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type FooterProps = Readonly<{
	visible: boolean;
	children: ReactNode;
}>;

export const Error = ({ children, visible }: FooterProps) => (
	<p
		className={twMerge("-mb-10 mt-3 text-red-600", visible ? "visible" : "invisible")}
		role="alert"
	>
		{children}
	</p>
);
