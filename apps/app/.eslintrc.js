module.exports = {
	root: true,
	extends: ["devfaq", "plugin:storybook/recommended"],
	parserOptions: {
		tsconfigRootDir: __dirname,
	},
	rules: {
		"@next/next/no-html-link-for-pages": ["error"],
	},
};
