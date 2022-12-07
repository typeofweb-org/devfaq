import { Fira_Sans, Fira_Code } from "@next/font/google";
import { AnalyticsWrapper } from "../components/analytics";
import { CtaHeader } from "../components/CtaHeader";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer";
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
		<html lang="pl" className={`${firaSans.variable} ${firaCode.variable}`}>
			<body>
				<AppProviders>
					<Header />
					<CtaHeader />
					{children}
					<AnalyticsWrapper />
					<Footer />
				</AppProviders>
			</body>
		</html>
	);
}
