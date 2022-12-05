import { AnalyticsWrapper } from "../components/analytics";
import { Header } from "../components/Header/Header";

import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pl">
			<body>
				<Header />
				{children}
				<AnalyticsWrapper />
			</body>
		</html>
	);
}
