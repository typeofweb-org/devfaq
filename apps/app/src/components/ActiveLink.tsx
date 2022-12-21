"use client";

import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import type { AnchorHTMLAttributes, ComponentProps } from "react";
import { LinkWithQuery } from "./LinkWithQuery/LinkWithQuery";

type ActiveLinkProps = Readonly<{
	activeClassName: string;
	activeHref?: string;
	activeAttributes?: AnchorHTMLAttributes<HTMLAnchorElement>;
}> &
	ComponentProps<typeof LinkWithQuery>;

export const ActiveLink = ({
	href,
	className,
	activeClassName,
	activeHref,
	activeAttributes,
	...props
}: ActiveLinkProps) => {
	const pathname = usePathname();

	const isActive = pathname?.startsWith(activeHref ? activeHref.toString() : href.toString());

	return (
		<LinkWithQuery
			href={href}
			className={twMerge(className, isActive && activeClassName)}
			{...(isActive && activeAttributes)}
			{...props}
		/>
	);
};
