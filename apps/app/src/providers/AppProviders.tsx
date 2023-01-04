"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UIProvider } from "./UIProvider";
import { ThemeProvider } from "./ThemeProvider";

type AppProvidersProps = Readonly<{
	children: ReactNode;
}>;

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

export const AppProviders = ({ children }: AppProvidersProps) => (
	<QueryClientProvider client={queryClient}>
		<ThemeProvider>
			<UIProvider>
				{children}
				<ReactQueryDevtools />
			</UIProvider>
		</ThemeProvider>
	</QueryClientProvider>
);
