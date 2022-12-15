"use client";

import type { UrlObject } from "url";
import Link from "next/link";
import { ComponentProps } from "react";
import { useDevFAQRouter } from "../hooks/useDevFAQRouter";

type Url = string | UrlObject;

const createQueryHref = (href: Url, query: Record<string, string>): Url => {
	if (typeof href === "string") {
		return { pathname: href, query };
	}

	const hrefQuery = !href.query
		? {}
		: typeof href.query === "string"
		? Object.fromEntries(new URLSearchParams(href.query).entries())
		: href.query;
	const newHrefQuery = { ...hrefQuery, ...query };

	return { ...href, query: newHrefQuery };
};

type LinkWithQueryProps = Readonly<{
	mergeQuery?: boolean;
}> &
	ComponentProps<typeof Link>;

export const LinkWithQuery = ({ href, mergeQuery, ...props }: LinkWithQueryProps) => {
	const { queryParams } = useDevFAQRouter();

	const linkHref = mergeQuery ? createQueryHref(href, queryParams) : href;

	return <Link href={linkHref} {...props} />;
};
