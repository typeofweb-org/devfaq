"use client";

import { UrlObject } from "url";
import Link, { LinkProps } from "next/link";
import { ComponentProps } from "react";
import { useDevFAQRouter } from "../../hooks/useDevFAQRouter";

type Url = LinkProps["href"];

const isURL = (value: string) =>
	/^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
		value,
	);

const isProtocolURL = (value: string) =>
	/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(
		value,
	);

const hrefToUrlObject = (linkHref: string): UrlObject => {
	const url = new URL(linkHref, "http://app.devfaq.localhost:3000");
	const { searchParams, hash, host, hostname, href, pathname, protocol, port } = url;
	const query = Object.fromEntries(searchParams.entries());

	return {
		query,
		hash,
		port,
		pathname:
			(isURL(linkHref) && !isProtocolURL(linkHref)) || !linkHref.startsWith("/")
				? pathname.substring(1)
				: pathname,
		...(isProtocolURL(linkHref) && { host, hostname, href, protocol }),
	};
};

export const createQueryHref = (href: Url, query: Record<string, string>): UrlObject => {
	const url = typeof href === "string" ? hrefToUrlObject(href) : href;

	const hrefQuery = !url.query
		? {}
		: typeof url.query === "string"
		? Object.fromEntries(new URLSearchParams(url.query).entries())
		: url.query;

	const newHrefQuery = { ...hrefQuery, ...query };

	return { ...url, query: newHrefQuery };
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
