import { ReactNode } from "react";

type QuestionsSidebarSection = Readonly<{
	title: string;
	children: ReactNode;
}>;

export const QuestionsSidebarSection = ({ title, children }: QuestionsSidebarSection) => (
	<section className="mt-6">
		<h2 className="mb-6 border-b border-violet-700 pb-2 text-sm text-violet-700 dark:border-neutral-200 dark:text-neutral-200">
			{title}
		</h2>
		{children}
	</section>
);
