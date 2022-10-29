module.exports = {
	root: true,
	// This tells ESLint to load the config from the package `eslint-config-devfaq`
	extends: ["devfaq"],
	settings: {
		next: {
			rootDir: ["apps/*/"],
		},
	},
};
