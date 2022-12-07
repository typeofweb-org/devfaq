import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";

type AppProvidersProps = Readonly<{
	children: ReactNode;
}>;

export const AppProviders = ({ children }: AppProvidersProps) => (
	<ThemeProvider>{children}</ThemeProvider>
);
