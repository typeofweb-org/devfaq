module.exports = {
	root: true,
	extends: ["devfaq"],
	parserOptions: {
		tsconfigRootDir: __dirname,
	},
	rules: {
		"@next/next/no-html-link-for-pages": ["error"],
	},
};
