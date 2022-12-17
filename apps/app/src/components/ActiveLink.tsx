"use client";

import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import type { ComponentProps } from "react";
import { LinkWithQuery } from "./LinkWithQuery/LinkWithQuery";

type ActiveLinkProps = Readonly<{
	activeClassName: string;
}> &
	ComponentProps<typeof LinkWithQuery>;

export const ActiveLink = ({ href, className, activeClassName, ...props }: ActiveLinkProps) => {
	const pathname = usePathname();

	const isActive = pathname?.startsWith(href.toString());

	return (
		<LinkWithQuery
			href={href}
			className={twMerge(className, isActive && activeClassName)}
			{...props}
		/>
	);
};
