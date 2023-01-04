"use client";

import Link from "next/link";
import { useIsHome } from "../hooks/useIsHome";
import { AppLogo } from "./AppLogo";

export const AppTitle = () => {
	const isHome = useIsHome();
	const Tag = isHome ? "h1" : "div";

	return (
		<Tag>
			<Link href="/questions/js/1">
				<span className="sr-only">DevFAQ</span>
				<AppLogo />
			</Link>
		</Tag>
	);
};
