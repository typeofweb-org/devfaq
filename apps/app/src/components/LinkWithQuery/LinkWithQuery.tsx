"use client";

import Link, { LinkProps } from "next/link";
import { ComponentProps } from "react";
import { useDevFAQRouter } from "../../hooks/useDevFAQRouter";

type Url = LinkProps["href"];

export const createQueryHref = (href: Url, query: Record<string, string>): Url => {
	if (typeof href === "string") {
		const { pathname, searchParams, hash } = new URL(href, "http://app.devfaq.localhost:3000");
		const params = Object.fromEntries(searchParams.entries());
		const newQuery = { ...params, ...query };

		return {
			pathname: href.startsWith("/") ? pathname : pathname.slice(1),
			query: newQuery,
			...(hash && { hash }),
		};
	}

	const hrefQuery = !href.query
		? {}
		: typeof href.query === "string"
		? Object.fromEntries(new URLSearchParams(href.query).entries())
		: href.query;
	const newHrefQuery = { ...hrefQuery, ...query };

	return { ...href, query: newHrefQuery };
};

const res = createQueryHref("test4?q1=href1&q2=href2&q3=href3#fragment", {
	q0: "query0",
	q1: "query1",
	q2: "query2",
	q3: "href3",
});
console.log(res);

type LinkWithQueryProps = Readonly<{
	mergeQuery?: boolean;
}> &
	ComponentProps<typeof Link>;

export const LinkWithQuery = ({ href, mergeQuery, ...props }: LinkWithQueryProps) => {
	const { queryParams } = useDevFAQRouter();

	const linkHref = mergeQuery ? createQueryHref(href, queryParams) : href;

	return <Link href={linkHref} {...props} />;
};
