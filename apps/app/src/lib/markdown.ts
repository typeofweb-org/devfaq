// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import remarkStripHtml from "remark-strip-html";
import rehypePrism from "rehype-prism-plus";
import { serialize } from "next-mdx-remote/serialize";

export const serializeSource = (source: string) =>
	serialize(source, {
		mdxOptions: {
			remarkPlugins: [remarkStripHtml],
			rehypePlugins: [rehypePrism],
		},
	});
