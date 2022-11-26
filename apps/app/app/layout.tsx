import { AnalyticsWrapper } from "../components/analytics";

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pl">
			<head></head>
			<body>
				{children}
				<AnalyticsWrapper />
			</body>
		</html>
	);
}
