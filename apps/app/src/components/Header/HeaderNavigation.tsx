"use client";

import { twMerge } from "tailwind-merge";
import { ReactNode, MouseEvent, useState, useEffect } from "react";
import FocusLock from "react-focus-lock";
import { lockScroll, unlockScroll } from "../../utils/pageScroll";
import { useIsAboveBreakpoint } from "../../hooks/useIsAboveBreakpoint";
import { ActiveNavigationLink } from "./ActiveNagivationLink";
import { LoginNavigationLink } from "./LoginNavigationLink";

const itemStyles = "ease h-0.5 w-6 bg-white transition duration-300";

export const HeaderNavigation = ({ children }: { children: ReactNode }) => {
	const [isAboveBreakpoint] = useIsAboveBreakpoint({ breakpoint: 640 });
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMenuManuallyOpen, setIsMenuManuallyOpen] = useState(false);

	const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		isMobileMenuOpen ? unlockScroll() : lockScroll();
		setIsMobileMenuOpen((prev) => !prev);
		setIsMenuManuallyOpen((prev) => !prev);
	};

	const handleClickLink = () => {
		setIsMobileMenuOpen(false);
		setIsMenuManuallyOpen(false);
		unlockScroll();
	};

	useEffect(() => {
		if (isMobileMenuOpen && isAboveBreakpoint) {
			setIsMobileMenuOpen(false);
			unlockScroll();
		}

		if (!isAboveBreakpoint && isMenuManuallyOpen) {
			setIsMobileMenuOpen(true);
			lockScroll();
		}
	}, [isAboveBreakpoint, isMenuManuallyOpen, isMobileMenuOpen]);

	return (
		<FocusLock disabled={isAboveBreakpoint || !isMobileMenuOpen} className="flex items-center">
			<nav
				id="header-navigation"
				className={twMerge(
					"fixed inset-0 z-30 flex flex-col items-center overflow-y-auto bg-primary py-20 text-xl uppercase sm:relative sm:flex sm:flex-row sm:items-center sm:gap-5 sm:py-0 sm:text-sm",
					isMobileMenuOpen && !isAboveBreakpoint ? "flex" : "hidden",
				)}
			>
				<div className="mt-auto mb-auto flex flex-col items-center gap-10 sm:flex-row sm:gap-5">
					<ul className="flex list-none flex-col items-center gap-10 text-center sm:flex-row sm:gap-5">
						<li>
							<ActiveNavigationLink href="/jak-korzystac" onClick={handleClickLink}>
								Jak korzystać?
							</ActiveNavigationLink>
						</li>
						<li>
							<ActiveNavigationLink href="/autorzy" onClick={handleClickLink}>
								Autorzy
							</ActiveNavigationLink>
						</li>
						<li>
							<a
								href="https://www.facebook.com/DevFAQ"
								target="_blank"
								rel="noreferrer"
								onClick={handleClickLink}
								className="transition-opacity hover:opacity-80"
							>
								Facebook
							</a>
						</li>
						<li>
							<div className="sm:w-14">
								<LoginNavigationLink />
							</div>
						</li>
					</ul>
					{children}
				</div>
			</nav>
			<button
				className={twMerge(
					"right-4 z-40 flex flex h-8 w-8 flex-col items-center justify-center gap-1.5 sm:hidden",
				)}
				onClick={handleButtonClick}
				type="button"
				aria-label={`${isMobileMenuOpen ? "Zamknij" : "Otwórz"} menu`}
				aria-expanded={isMobileMenuOpen}
				aria-controls="header-navigation"
			>
				<div className={twMerge(itemStyles, isMobileMenuOpen && "translate-y-2 rotate-45")} />
				<div className={twMerge(itemStyles, isMobileMenuOpen ? "opacity-0" : "opacity-100")} />
				<div className={twMerge(itemStyles, isMobileMenuOpen && "-translate-y-2 -rotate-45")} />
			</button>
		</FocusLock>
	);
};
