import { AnalyticsWrapper } from "../components/analytics";
import { Footer } from "../components/Footer";

import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pl">
			<body>
				{children}
				<AnalyticsWrapper />
				<Footer />
			</body>
		</html>
	);
}
