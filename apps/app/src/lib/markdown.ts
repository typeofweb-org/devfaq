import remarkPrism from "remark-prism";
import { serialize } from "next-mdx-remote/serialize";

export const serializeSource = (source: string) =>
	serialize(source, {
		mdxOptions: {
			remarkPlugins: [remarkPrism],
		},
	});
