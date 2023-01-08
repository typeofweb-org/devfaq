const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{ts,tsx,css}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"white-dark": "var(--white-dark)",
				primary: "var(--primary)",
				red: {
					branding: "var(--red-branding)",
					"branding-dark": "var(--red-branding-dark)",
				},
				yellow: {
					branding: "var(--yellow-branding)",
					"branding-dark": "var(--yellow-branding-dark)",
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
					50: "var(--violet-50)",
					100: "var(--violet-100)",
					200: "var(--violet-200)",
					300: "var(--violet-300)",
					400: "var(--violet-400)",
					500: "var(--violet-500)",
					600: "var(--violet-600)",
					700: "var(--violet-700)",
					800: "var(--violet-800)",
					900: "var(--violet-900)",
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
				loader: {
					"0%": { transform: "rotate(0deg)" },
					"25%": { transform: "rotate(180deg)" },
					"50%": { transform: "rotate(180deg)" },
					"75%": { transform: "rotate(360deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
				"loader-inner": {
					"0%": { height: "0%;" },
					"25%": { height: "0%;" },
					"50%": { height: "100%;" },
					"75%": { height: "100%;" },
					"100%": { height: "0%;" },
				},
			},
			animation: {
				show: "show 0.2s",
				loader: "loader 2s infinite ease",
				"loader-inner": "loader-inner 2s infinite ease-in",
			},
			spacing: {
				62: "15.5rem",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
