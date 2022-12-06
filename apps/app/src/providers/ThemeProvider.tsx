"use client";

import { ReactNode, useEffect, useState } from "react";
import { createSafeContext } from "../lib/createSafeContext";

type Theme = "light" | "dark";

interface ThemeContextValue {
	theme: Theme;
	changeTheme: (theme: Theme) => void;
}

const [useContext, Provider] = createSafeContext<ThemeContextValue>();

const getCurrentTheme = (): Theme => {
	const localStorageTheme = window.localStorage.getItem("theme");

	if (localStorageTheme === "light" || localStorageTheme === "dark") {
		return localStorageTheme;
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const ThemeProvider = ({ children }: { readonly children: ReactNode }) => {
	const [theme, setTheme] = useState<Theme>("light");

	const changeTheme = (theme: Theme) => {
		window.localStorage.setItem("theme", theme);

		setTheme(theme);
	};

	useEffect(() => {
		setTheme(getCurrentTheme());
	}, []);

	useEffect(() => {
		const target = document.querySelector("html");

		if (theme === "dark") {
			target?.classList.add("dark");
		} else {
			target?.classList.remove("dark");
		}
	}, [theme]);

	return (
		<Provider
			value={{
				theme,
				changeTheme,
			}}
		>
			{children}
		</Provider>
	);
};

export const useThemeContext = useContext;
