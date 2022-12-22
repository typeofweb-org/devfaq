"use client";
import { UrlObject } from "url";
import Link, { LinkProps } from "next/link";
import { ComponentProps } from "react";
import { useDevFAQRouter } from "../../hooks/useDevFAQRouter";
import { escapeStringRegexp } from "../../lib/escapeStringRegex";

type Url = LinkProps["href"];

const origin = process.env.NEXT_PUBLIC_APP_URL || "http://dummy.localhost:8080";

const urlObjectToUrl = (urlObject: UrlObject, origin: string): URL => {
	const url = new URL(origin);
	if (urlObject.protocol) url.protocol = urlObject.protocol;
	if (urlObject.auth) {
		const auth = urlObject.auth.split(":");
		url.username = auth[0] || url.username;
		url.password = auth[1] || url.password;
	}
	if (urlObject.host) url.host = urlObject.host;
	if (urlObject.hostname) url.hostname = urlObject.hostname;
	if (urlObject.port) url.port = urlObject.port.toString();
	if (urlObject.hash) url.hash = urlObject.hash;
	if (urlObject.search) url.search = urlObject.search;
	if (urlObject.query)
		url.search = new URLSearchParams(urlObject.query as Record<string, string> | string).toString();
	if (urlObject.pathname) url.pathname = urlObject.pathname;

	return url;
};

export const createQueryHref = (href: Url, query: Record<string, string>): string => {
	const url = typeof href === "string" ? new URL(href, origin) : urlObjectToUrl(href, origin);
	Object.entries(query).forEach(([key, value]) => {
		if (url.searchParams.get(key) === null) {
			url.searchParams.set(key, value);
		}
	});

	const newHref = url.toString().replace(new RegExp("^" + escapeStringRegexp(origin)), "");

	if (newHref.startsWith("/") && typeof href === "string" && !href.startsWith("/")) {
		// trim slash
		return newHref.slice(1);
	}
	return newHref;
};

type LinkWithQueryProps = Readonly<{
	mergeQuery?: boolean;
}> &
	ComponentProps<typeof Link>;

export const LinkWithQuery = ({ href, mergeQuery, ...props }: LinkWithQueryProps) => {
	const { queryParams } = useDevFAQRouter();

	const linkHref = mergeQuery ? createQueryHref(href, queryParams) : createQueryHref(href, {});

	return <Link href={linkHref} {...props} />;
};
