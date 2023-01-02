import { PAGE_SIZE } from "../../lib/constants";
import { technologies, Technology } from "../../lib/technologies";
import { getAllQuestions } from "../../services/questions.service";
import { APIQuestion, Question } from "../../types";
import { range } from "../../utils/utils";

export const config = {
	runtime: "experimental-edge",
};

type Item = {
	path: string;
	changefreq: "daily" | "monthly" | "always" | "hourly" | "weekly" | "yearly" | "never";
	priority: number;
};

const sitemapXml = (items: readonly Item[]): string => {
	const xml = itemsToXml(items);
	return `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${xml}
</urlset>
`.trim();
};

const itemsToXml = (items: readonly Item[]): string => {
	const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
	if (!APP_URL) {
		throw new Error(`Missing NEXT_PUBLIC_APP_URL!`);
	}

	return items
		.map((item) => {
			return `
<url>
	<loc>${APP_URL}${item.path}</loc>
	<changefreq>${item.changefreq}</changefreq>
	<priority>${item.priority}</priority>
</url>
		`.trim();
		})
		.join("\n");
};

export default async function SitemapHandler(req: Request) {
	const questions = await getAllQuestions({});
	const questionsByTechnology = questions.data.data.reduce((acc, question) => {
		acc[question._categoryId] ??= [];
		acc[question._categoryId].push(question);
		return acc;
	}, {} as Record<Technology, APIQuestion[]>);

	const items = [
		{ path: "/", changefreq: "hourly", priority: 1 },
		{ path: "/autorzy", changefreq: "weekly", priority: 0.6 },
		{ path: "/jak-korzystac", changefreq: "weekly", priority: 0.5 },
		{ path: "/regulamin", changefreq: "monthly", priority: 0.1 },

		...Object.entries(questionsByTechnology).flatMap(([technology, questions]) => {
			const pages = Math.ceil(questions.length / PAGE_SIZE);
			return range(1, pages + 1).map((page) => {
				return {
					path: `/questions/${technology}/${page}`,
					changefreq: "hourly",
					priority: 0.9,
				} as const;
			});
		}),
		...questions.data.data.flatMap((question) => {
			return {
				path: `/questions/p/${question.id}`,
				changefreq: "daily",
				priority: 0.8,
			} as const;
		}),
	] as const;

	return new Response(sitemapXml(items), {
		headers: {
			"Content-Type": "application/xml",
			"Cache-Control":
				"public, maxage=3600, s-maxage=3600, stale-while-revalidate=3600, stale-if-error=86400",
		},
	});
}
