import type { MouseEventHandler, ReactNode } from "react";
import { ActiveLink } from "../ActiveLink";

type ActiveNavigationLinkProps = Readonly<{
	href: string;
	children: ReactNode;
	onClick?: MouseEventHandler<HTMLAnchorElement>;
	className?: string;
}>;

export const ActiveNavigationLink = (props: ActiveNavigationLinkProps) => (
	<ActiveLink
		className="border-b border-transparent transition-opacity hover:opacity-80"
		activeClassName="border-white"
		{...props}
	/>
);
