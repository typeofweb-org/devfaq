/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	transpilePackages: [],
	experimental: {
		appDir: true,
		esmExternals: true,
		fontLoaders: [{ loader: "@next/font/google", options: { subsets: ["latin", "latin-ext"] } }],
		serverComponentsExternalPackages: ["remark-gfm", "remark-prism"],
		legacyBrowsers: false,
	},
	images: {
		remotePatterns: [
			...["", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => ({
				protocol: "https",
				hostname: `avatars${number}.githubusercontent.com`,
			})),
		],
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		});

		return config;
	},
	async rewrites() {
		return [
			{
				source: "/sitemap.xml",
				destination: "/api/sitemap.xml",
			},
		];
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/questions/js/1",
				permanent: false,
			},
			{
				source: "/questions",
				destination: "/questions/js/1",
				permanent: false,
			},
			{
				source: "/admin",
				destination: "/admin/pending/1",
				permanent: false,
			},
			{
				source: "/questions/:technology",
				destination: "/questions/:technology/1",
				permanent: false,
			},
			{
				source: "/authors",
				destination: "/autorzy",
				permanent: false,
			},
			{
				source: "/regulations",
				destination: "/regulamin",
				permanent: false,
			},
			{
				source: "/about",
				destination: "/jak-korzystac",
				permanent: false,
			},
			{
				source: "/user",
				destination: "/user/questions/1",
				permanent: false,
			},
			{
				source: "/user/questions",
				destination: "/user/questions/1",
				permanent: false,
			},
			{
				source: "/answers",
				destination: "/answers/1",
				permanent: false,
			},
		];
	},
};

module.exports = nextConfig;
