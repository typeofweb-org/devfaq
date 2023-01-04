import { Fira_Sans, Fira_Code } from "@next/font/google";
import { AnalyticsWrapper } from "../components/analytics";
import { AppProviders } from "../providers/AppProviders";

import "../styles/globals.css";

const firaSans = Fira_Sans({
	weight: ["200", "400", "700"],
	variable: "--font-fira-sans",
});

const firaCode = Fira_Code({
	weight: "variable",
	variable: "--font-fira-code",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="pl-PL"
			prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#"
			itemType="http://schema.org/WebPage"
			className={`${firaSans.variable} ${firaCode.variable}`}
		>
			<body>
				<AppProviders>{children}</AppProviders>
				<AnalyticsWrapper />
			</body>
		</html>
	);
}
