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
};

module.exports = nextConfig;
