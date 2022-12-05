"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ActiveLinkProps = Readonly<{
	href: string;
	activeClassName: string;
	children: ReactNode;
}>;

export const ActiveLink = ({ href, activeClassName, children }: ActiveLinkProps) => {
	const pathname = usePathname();
	const isActive = href === pathname;

	return (
		<Link href={href} className={twMerge(isActive && activeClassName)}>
			{children}
		</Link>
	);
};
