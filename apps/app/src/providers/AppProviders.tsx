import { ReactNode } from "react";
import { ModalProvider } from "./ModalProvider";
import { ThemeProvider } from "./ThemeProvider";

type AppProvidersProps = Readonly<{
	children: ReactNode;
}>;

export const AppProviders = ({ children }: AppProvidersProps) => (
	<ThemeProvider>
		<ModalProvider>{children}</ModalProvider>
	</ThemeProvider>
);
