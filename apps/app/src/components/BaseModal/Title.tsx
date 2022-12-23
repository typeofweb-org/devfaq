import type { ReactNode } from "react";

type TitleProps = Readonly<{
	children: ReactNode;
}>;

export const Title = ({ children }: TitleProps) => (
	<h2 className="text-center text-xl font-bold uppercase text-primary dark:text-neutral-200">
		{children}
	</h2>
);
