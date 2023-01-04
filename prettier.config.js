module.exports = {
	semi: true,
	singleQuote: false,
	trailingComma: "all",
	printWidth: 100,
	useTabs: true,
	plugins: [require("prettier-plugin-tailwindcss")],
	tailwindConfig: "./apps/app/tailwind.config.js",
};
