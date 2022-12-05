import { AnalyticsWrapper } from "../components/analytics";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pl">
			<body>
				<Header />
				{children}
				<AnalyticsWrapper />
				<Footer />
			</body>
		</html>
	);
}
