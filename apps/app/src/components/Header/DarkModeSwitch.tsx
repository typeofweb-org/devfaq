"use client";

import { twMerge } from "tailwind-merge";
import { useThemeContext } from "../../providers/ThemeProvider";

export const DarkModeSwitch = () => {
	const { theme, changeTheme } = useThemeContext();

	return (
		<input
			type="checkbox"
			role="switch"
			aria-label="Switch between Dark and Light mode"
			className={twMerge(
				"relative h-6 w-10 cursor-pointer appearance-none rounded-full bg-violet-800 dark:bg-violet-700",
				"before:absolute before:top-1 before:left-1 before:h-[16px] before:w-[16px] before:rounded-full before:bg-white before:transition-all before:duration-200",
				"[&:checked]:before:left-[calc(100%-0.25rem)] [&:checked]:before:-translate-x-full",
			)}
			checked={theme === "dark"}
			onChange={() => changeTheme(theme === "dark" ? "light" : "dark")}
		/>
	);
};
