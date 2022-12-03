import { AnalyticsWrapper } from "../components/analytics";

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pl">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
			</head>
			<body>
				{children}
				<AnalyticsWrapper />
			</body>
		</html>
	);
}
