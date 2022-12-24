"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import type { ReactNode, MouseEvent } from "react";
import { lockScroll, unlockScroll } from "../../utils/pageScroll";
import { OpacityElement } from "../OpacityElement";
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
					"fixed inset-0 z-30 flex flex-col items-center overflow-y-auto bg-primary py-20 text-xl uppercase sm:relative sm:flex sm:flex-row sm:items-center sm:gap-5 sm:py-0 sm:text-sm",
					isOpen ? "flex" : "hidden",
				)}
			>
				<div className="mt-auto mb-auto flex flex-col items-center gap-10 sm:flex-row sm:gap-5">
					<ul className="flex list-none flex-col items-center gap-10 text-center sm:flex-row sm:gap-5">
						<li>
							<OpacityElement>
								<ActiveNavigationLink href="/about" onClick={handleClickLink}>
									Jak korzystać?
								</ActiveNavigationLink>
							</OpacityElement>
						</li>
						<li>
							<OpacityElement>
								<ActiveNavigationLink href="/authors" onClick={handleClickLink}>
									Autorzy
								</ActiveNavigationLink>
							</OpacityElement>
						</li>
						<li>
							<OpacityElement>
								<a
									href="https://www.facebook.com/DevFAQ"
									target="_blank"
									rel="noreferrer"
									onClick={handleClickLink}
								>
									Facebook
								</a>
							</OpacityElement>
						</li>
						<li>
							<OpacityElement>
								<div className="sm:w-14">
									<LoginNavigationLink />
								</div>
							</OpacityElement>
						</li>
					</ul>
					{children}
				</div>
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
