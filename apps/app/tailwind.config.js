const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"white-dark": "oklch(31% 0 0)",
				primary: "var(--primary)",
				red: {
					branding: "oklch(58% 0.21 17)",
					"branding-dark": "oklch(54% 0.21 17)",
				},
				yellow: {
					branding: "oklch(83% 0.17 80)",
					"branding-dark": "oklch(79% 0.17 80)",
				},
				junior: {
					light: "var(--junior-light-color)",
					main: "var(--junior-main-color)",
					"main-dark": "var(--junior-main-color-dark)",
					"main-darker": "var(--junior-main-color-darker)",
					"main-light": "var(--junior-main-color-light)",
				},
				mid: {
					light: "var(--mid-light-color)",
					main: "var(--mid-main-color)",
					"main-dark": "var(--mid-main-color-dark)",
					"main-darker": "var(--mid-main-color-darker)",
					"main-light": "var(--mid-main-color-light)",
				},
				senior: {
					light: "var(--senior-light-color)",
					main: "var(--senior-main-color)",
					"main-dark": "var(--senior-main-color-dark)",
					"main-darker": "var(--senior-main-color-darker)",
					"main-light": "var(--senior-main-color-light)",
				},
				violet: {
					50: "oklch(95% 0.017 295)",
					100: "oklch(87% 0.047 295)",
					200: "oklch(85.5% 0.045 295)",
					300: "oklch(78% 0.091 295)",
					400: "oklch(68% 0.137 295)",
					500: "oklch(59% 0.179 295)",
					600: "oklch(50.5% 0.212 295)",
					700: "oklch(47.5% 0.186 295)",
					800: "oklch(34.5% 0.166 295)",
					900: "oklch(34% 0.09 295)",
				},
			},
			fontFamily: {
				sans: ["var(--font-fira-sans)", ...defaultTheme.fontFamily.sans],
				mono: ["var(--font-fira-code)", ...defaultTheme.fontFamily.mono],
			},
			screens: {
				"small-filters": { raw: "screen and (min-width: 640px) and (max-height: 800px)" },
			},
			keyframes: {
				show: {
					from: { transform: "scale(0.95)" },
					to: { transform: "scale(1)" },
				},
			},
			animation: {
				show: "show 0.2s",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
