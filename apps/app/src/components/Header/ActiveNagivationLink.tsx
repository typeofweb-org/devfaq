import type { ComponentProps } from "react";
import { ActiveLink } from "../ActiveLink";

type ActiveNavigationLinkProps = Omit<
	ComponentProps<typeof ActiveLink>,
	"className" | "activeClassName"
>;

export const ActiveNavigationLink = (props: ActiveNavigationLinkProps) => (
	<ActiveLink className="border-b border-transparent" activeClassName="border-white" {...props} />
);
