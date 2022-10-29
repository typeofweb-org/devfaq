/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint", "formatjs"],
	extends: [
		"next",
		"next/core-web-vitals",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
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
		"@next/next/no-html-link-for-pages": ["off"],
	},
};
