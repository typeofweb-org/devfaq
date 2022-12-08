import { ReactNode } from "react";
import { UIProvider } from "./UIProvider";
import { ThemeProvider } from "./ThemeProvider";

type AppProvidersProps = Readonly<{
	children: ReactNode;
}>;

export const AppProviders = ({ children }: AppProvidersProps) => (
	<ThemeProvider>
		<UIProvider>{children}</UIProvider>
	</ThemeProvider>
);
