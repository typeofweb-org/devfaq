module.exports = {
	root: true,
	extends: ["devfaq", "plugin:storybook/recommended", "plugin:cypress/recommended"],
	parserOptions: {
		tsconfigRootDir: __dirname,
	},
	rules: {},
};
