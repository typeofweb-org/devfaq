"use client";

import { MDXRemote } from "next-mdx-remote";
import { ComponentProps, useEffect, useState } from "react";

export const MDXRemoteWrapper = (props: ComponentProps<typeof MDXRemote>) => {
	const [component, setComponent] = useState<JSX.Element | null>(null);

	useEffect(() => {
		setComponent(<MDXRemote {...props} />);
	}, [props]);

	return component;
};
