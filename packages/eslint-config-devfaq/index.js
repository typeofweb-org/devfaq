/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	extends: [
		"next",
		"next/core-web-vitals",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:import/recommended",
		"plugin:import/typescript",
		"prettier",
	],
	parserOptions: {
		project: ["tsconfig.json"],
	},
	settings: {
		next: {
			rootDir: ["apps/*/", "packages/*/"],
		},
		react: {
			version: "detect",
		},
	},
	ignorePatterns: ["build/", ".turbo/", "dist/", "node_modules/", "*.js", "*.jsx"],
	rules: {
		"@typescript-eslint/require-await": "off",
		"@typescript-eslint/no-empty-interface": "off",
		"@typescript-eslint/no-unused-vars": "off",
		"@next/next/no-html-link-for-pages": "off",
		"import/order": "error",
	},
};
