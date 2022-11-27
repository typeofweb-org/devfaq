/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		appDir: true,
		transpilePackages: [],
		esmExternals: true,
	},
};

module.exports = nextConfig;
