"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import type { ReactNode, MouseEvent } from "react";
import { lockScroll, unlockScroll } from "../../utils/pageScroll";
import { ActiveNavigationLink } from "./ActiveNagivationLink";
import { LoginNavigationLink } from "./LoginNavigationLink";

const itemStyles = "ease h-0.5 w-6 bg-white transition duration-300";

export const HeaderNavigation = ({ children }: { children: ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		isOpen ? unlockScroll() : lockScroll();
		setIsOpen((prev) => !prev);
	};

	const handleClickLink = () => {
		setIsOpen(false);
		unlockScroll();
	};

	return (
		<>
			<nav
				id="header-navigation"
				className={twMerge(
					"fixed top-0 left-0 z-30 h-full w-full flex-col items-center justify-center gap-10 bg-primary text-xl uppercase sm:gap-5 sm:text-sm",
					"sm:relative sm:flex sm:h-fit sm:w-fit sm:flex-row",
					isOpen ? "flex" : "hidden",
				)}
			>
				<ActiveNavigationLink href="/about" onClick={handleClickLink}>
					Jak korzystać?
				</ActiveNavigationLink>
				<ActiveNavigationLink href="/authors" onClick={handleClickLink}>
					Autorzy
				</ActiveNavigationLink>
				<a
					href="https://www.facebook.com/DevFAQ"
					target="_blank"
					rel="noreferrer"
					onClick={handleClickLink}
				>
					Facebook
				</a>
				<div className="sm:w-14">
					<LoginNavigationLink />
				</div>
				{children}
			</nav>
			<button
				className={twMerge(
					"right-4 z-40 flex h-8 w-8 flex-col items-center justify-center gap-1.5 sm:hidden",
					isOpen ? "fixed" : "absolute",
				)}
				onClick={handleButtonClick}
				type="button"
				aria-label={`${isOpen ? "Zamknij" : "Otwórz"} menu`}
				aria-expanded={isOpen}
				aria-controls="header-navigation"
			>
				<div className={twMerge(itemStyles, isOpen && "translate-y-2 rotate-45")} />
				<div className={twMerge(itemStyles, isOpen ? "opacity-0" : "opacity-100")} />
				<div className={twMerge(itemStyles, isOpen && "-translate-y-2 -rotate-45")} />
			</button>
		</>
	);
};
