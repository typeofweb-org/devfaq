import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ModalTitleProps = Readonly<{
	children: ReactNode;
	modalId: string;
	className?: string;
}>;

export const ModalTitle = ({ children, modalId, className }: ModalTitleProps) => (
	<h2
		className={twMerge(
			"text-center text-xl font-bold uppercase text-primary dark:text-neutral-200",
			className,
		)}
		id={`${modalId}-title`}
	>
		{children}
	</h2>
);
