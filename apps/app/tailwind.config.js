const violet = {
	50: "oklch(95.27% 0.017 295)",
	100: "oklch(87.14% 0.047 295)",
	200: "oklch(85.48% 0.045 295)",
	300: "oklch(78.29% 0.091 295)",
	400: "oklch(68.26% 0.137 295)",
	500: "oklch(58.95% 0.179 295)",
	600: "oklch(50.69% 0.212 295)",
	700: "oklch(47.42% 0.186 295)",
	800: "oklch(34.61% 0.166 295)",
	900: "oklch(33.84% 0.09 295)",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: violet[700],
				violet,
			},
		},
	},
	plugins: [],
};
