import rehypePrism from "rehype-prism-plus";
import { serialize } from "next-mdx-remote/serialize";

export const serializeSource = (source: string) =>
	serialize(source, {
		mdxOptions: {
			rehypePlugins: [rehypePrism],
			format: "md",
		},
	});
