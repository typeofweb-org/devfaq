import type { ReactNode } from "react";

type ModalTitleProps = Readonly<{
	children: ReactNode;
}>;

export const ModalTitle = ({ children }: ModalTitleProps) => (
	<h2 className="text-center text-xl font-bold uppercase text-primary dark:text-neutral-200">
		{children}
	</h2>
);
