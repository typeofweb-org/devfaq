import type { ReactNode } from "react";

type ModalFooterProps = Readonly<{
	children: ReactNode;
}>;

export const ModalFooter = ({ children }: ModalFooterProps) => (
	<div className="mt-3 flex flex-col gap-2 sm:flex-row-reverse">{children}</div>
);
