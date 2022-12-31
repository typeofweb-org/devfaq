import { ReactNode } from "react";

type QuestionsSidebarSection = Readonly<{
	title: string;
	children: ReactNode;
}>;

export const QuestionsSidebarSection = ({ title, children }: QuestionsSidebarSection) => (
	<section className="px-1 pb-6 sm:last-of-type:pb-0">
		<h2 className="mb-4 border-b border-violet-700 pb-2 text-sm text-violet-700 dark:border-neutral-200 dark:text-neutral-200 sm:mb-4">
			{title}
		</h2>
		{children}
	</section>
);
