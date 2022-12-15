/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		appDir: true,
		transpilePackages: [],
		esmExternals: true,
		fontLoaders: [{ loader: "@next/font/google", options: { subsets: ["latin", "latin-ext"] } }],
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
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
