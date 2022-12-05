"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import type { ComponentProps, ReactNode } from "react";

type ActiveLinkProps = Readonly<{
	href: string;
	activeClassName: string;
	children: ReactNode;
}> &
	ComponentProps<typeof Link>;

export const ActiveLink = ({
	href,
	className,
	activeClassName,
	children,
	...rest
}: ActiveLinkProps) => {
	const pathname = usePathname();
	const isActive = href === pathname;

	return (
		<Link href={href} className={twMerge(className, isActive && activeClassName)} {...rest}>
			{children}
		</Link>
	);
};
