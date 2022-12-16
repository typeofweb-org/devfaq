import { ReactNode } from "react";
import { Container } from "./Container";

type StaticPageContainerProps = Readonly<{
	children: ReactNode;
}>;

export const StaticPageContainer = ({ children }: StaticPageContainerProps) => (
	<Container
		as="section"
		className="static-page-shadow my-3 bg-white p-4 text-neutral-800 dark:bg-white-dark dark:text-neutral-200 sm:p-4"
	>
		{children}
	</Container>
);
