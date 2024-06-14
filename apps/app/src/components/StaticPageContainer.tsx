import { ReactNode } from "react";
import { Container } from "./Container";

type StaticPageContainerProps = Readonly<{
	children: ReactNode;
}>;

export const StaticPageContainer = ({ children }: StaticPageContainerProps) => (
	<Container
		as="article"
		className="static-page-shadow prose my-3 scroll-mt-14 bg-white p-4 pb-16 text-neutral-800 dark:prose-invert dark:bg-white-dark dark:text-neutral-200 sm:p-8 sm:pb-16"
		id="main-content"
	>
		{children}
	</Container>
);
