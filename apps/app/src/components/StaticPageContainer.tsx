import { ReactNode } from "react";
import { Container } from "./Container";

type StaticPageContainerProps = Readonly<{
	children: ReactNode;
}>;

export const StaticPageContainer = ({ children }: StaticPageContainerProps) => (
	<Container
		as="article"
		className="static-page-shadow prose my-3 bg-white p-4 pb-16 text-neutral-800 dark:bg-white-dark dark:prose-invert dark:text-neutral-200 sm:p-8 sm:pb-16"
	>
		{children}
	</Container>
);
