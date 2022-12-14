"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import type { ComponentProps } from "react";
import { useDevFAQRouter } from "../hooks/useDevFAQRouter";

type ActiveLinkProps = Readonly<{
	activeClassName: string;
}> &
	ComponentProps<typeof Link>;

export const ActiveLink = ({ href, className, activeClassName, ...props }: ActiveLinkProps) => {
	const pathname = usePathname();
	const { queryParams } = useDevFAQRouter();

	const isActive = pathname?.startsWith(href.toString());

	return (
		<Link
			href={{
				pathname: href.toString(),
				query: queryParams,
			}}
			className={twMerge(className, isActive && activeClassName)}
			{...props}
		/>
	);
};
