import rehypePrism from "rehype-prism-plus";
import strip from "strip-markdown";

import { serialize } from "next-mdx-remote/serialize";
import { remark } from "remark";

export const serializeSource = (source: string) =>
	serialize(source, {
		mdxOptions: {
			rehypePlugins: [rehypePrism],
			jsx: false,
			format: "md",
		},
	});

export const stripMarkdown = async (source: string, { stripCode }: { stripCode: boolean }) => {
	const codeRegex = /(?:\n|^)```\w*\n(.*?)\n```(?:\n|$)/gs;

	try {
		const vfile = await remark()
			.use(strip, { keep: ["code"] })
			.process(source);
		return String(vfile)
			.replaceAll(codeRegex, stripCode ? "\n" : "\n$1\n")
			.replaceAll(/\s+/g, " ")
			.replaceAll(/\\/g, "")
			.trim();
	} catch (err) {
		console.error(err);
		return "";
	}
};
