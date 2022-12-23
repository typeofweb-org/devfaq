import type { ReactNode } from "react";

type FooterProps = Readonly<{
	children: ReactNode;
}>;

export const Footer = ({ children }: FooterProps) => (
	<div className="mt-3 flex flex-col gap-2 sm:flex-row-reverse">{children}</div>
);
