"use client";

import Link from "next/link";
import { useIsHome } from "../hooks/useIsHome";
import { AppLogo } from "./AppLogo";

type TitleTag = keyof Pick<JSX.IntrinsicElements, "h1" | "span">;

export const AppTitle = () => {
	const { isHome } = useIsHome();

	const Tag: TitleTag = isHome ? "h1" : "span";

	return (
		<Tag>
			<Link href={`${isHome ? "#" : "/"}`}>
				<span className="sr-only">DevFAQ</span>
				<AppLogo />
			</Link>
		</Tag>
	);
};
