import rehypePrism from "rehype-prism-plus";
import xss from "xss";
import { serialize } from "next-mdx-remote/serialize";

export const serializeSource = (source: string) =>
	serialize(xss(source, { whiteList: {} }), {
		mdxOptions: {
			rehypePlugins: [rehypePrism],
			format: "md",
		},
	});
