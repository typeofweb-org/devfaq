"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import type { ComponentProps } from "react";

type ActiveLinkProps = Readonly<{
	activeClassName: string;
	activeHref?: string;
}> &
	ComponentProps<typeof Link>;

export const ActiveLink = ({
	href,
	className,
	activeClassName,
	activeHref,
	children,
	...rest
}: ActiveLinkProps) => {
	const pathname = usePathname();
	const isActive = pathname?.startsWith(activeHref || href.toString());

	return (
		<Link href={href} className={twMerge(className, isActive && activeClassName)} {...rest}>
			{children}
		</Link>
	);
};
