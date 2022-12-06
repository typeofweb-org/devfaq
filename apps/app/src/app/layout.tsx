import { Fira_Sans, Fira_Code } from "@next/font/google";
import { AnalyticsWrapper } from "../components/analytics";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer";

import "../styles/globals.css";

const firaSans = Fira_Sans({
	weight: ["200", "400", "700"],
	variable: "--font-fira-sans",
});

const firaCode = Fira_Code({
	weight: ["400", "700"],
	variable: "--font-fira-code",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pl" className={`${firaSans.variable} ${firaCode.variable}`}>
			<body>
				<Header />
				{children}
				<AnalyticsWrapper />
				<Footer />
			</body>
		</html>
	);
}
