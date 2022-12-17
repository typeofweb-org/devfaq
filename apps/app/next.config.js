/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		appDir: true,
		transpilePackages: [],
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
	async redirects() {
		return [
			{
				source: "/questions",
				destination: "/questions/js/1",
				permanent: true,
			},
			{
				source: "/questions/:technology",
				destination: "/questions/:technology/1",
				permanent: true,
			},
		];
	},
};

module.exports = nextConfig;
