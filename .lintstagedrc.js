module.exports = {
	"*.{js,jsx,ts,tsx,md,mdx,graphql,yml,yaml,css,scss,json}": ["pnpm prettier --write"],
	"*.{js,jsx,ts,tsx}": [() => "pnpm lint:fix"],
};
