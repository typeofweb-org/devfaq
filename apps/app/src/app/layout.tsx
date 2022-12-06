import { AnalyticsWrapper } from "../components/analytics";
import { CtaHeader } from "../components/CtaHeader";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer";

import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pl">
			<body>
				<Header />
				<CtaHeader />
				{children}
				<AnalyticsWrapper />
				<Footer />
			</body>
		</html>
	);
}
