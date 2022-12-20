import type { MouseEventHandler, ReactNode } from "react";
import { ActiveLink } from "../ActiveLink";

type ActiveNavigationLinkProps = Readonly<{
	href: string;
	children: ReactNode;
	onClick?: MouseEventHandler<HTMLAnchorElement>;
}>;

export const ActiveNavigationLink = (props: ActiveNavigationLinkProps) => (
	<ActiveLink className="border-b border-transparent" activeClassName="border-white" {...props} />
);
