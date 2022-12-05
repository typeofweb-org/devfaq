"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import type { ReactNode } from "react";

const itemStyles = "ease h-0.5 w-6 bg-white transition duration-300";

export const HeaderNavigation = ({ children }: { children: ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<nav
				className={twMerge(
					"fixed top-0 left-0 h-full w-full flex-col items-center justify-center gap-5 bg-violet-600 uppercase",
					"sm:relative sm:flex sm:h-fit sm:w-fit sm:flex-row",
					isOpen ? "flex" : "hidden",
				)}
			>
				{children}
			</nav>
			<button
				className="fixed right-4 flex h-8 w-8 flex-col items-center justify-center gap-1.5 sm:hidden"
				onClick={() => setIsOpen((prev) => !prev)}
			>
				<div className={twMerge(itemStyles, isOpen && "translate-y-2 rotate-45")} />
				<div className={twMerge(itemStyles, isOpen ? "opacity-0" : "opacity-100")} />
				<div className={twMerge(itemStyles, isOpen && "-translate-y-2 -rotate-45")} />
			</button>
		</>
	);
};
