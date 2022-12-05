/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				violet: {
					50: "#F1EDF9",
					100: "#DACEEF",
					200: "#D4C9E9",
					300: "#C2ABEA",
					400: "#A684E1",
					500: "#8B5FD8",
					600: "#713CCF",
					700: "#673AB7",
					800: "#401886",
					900: "#3E2B5F",
				},
			},
		},
	},
	plugins: [],
};
