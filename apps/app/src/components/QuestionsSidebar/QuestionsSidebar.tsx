"use client";

import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useUIContext } from "../../providers/UIProvider";
import { Button } from "../Button/Button";
import { CloseButton } from "../CloseButton/CloseButton";
import { lockScroll, unlockScroll } from "../../utils/pageScroll";
import { LevelFilter } from "./LevelFilter/LevelFilter";
import { TechnologyFilter } from "./TechnologyFilter/TechnologyFilter";

export const QuestionsSidebar = () => {
	const { isSidebarOpen, closeSidebar } = useUIContext();

	useEffect(() => {
		if (isSidebarOpen) {
			lockScroll(true);
		} else {
			unlockScroll(true);
		}
	}, [isSidebarOpen]);

	return (
		<aside
			className={twMerge(
				"border-aside fixed inset-0 z-50 flex shrink-0 -translate-x-full transform-gpu flex-col overflow-y-auto bg-gray-50 px-2.5 py-6 pb-4 transition-transform duration-200 dark:bg-neutral-800 sm:sticky sm:top-[56px] sm:z-auto sm:h-[calc(100vh-56px)] sm:w-62 sm:translate-x-0 sm:border-r-8 sm:pl-0 sm:pr-10 sm:transition-none sm:after:inline",
				isSidebarOpen && "translate-x-0",
			)}
		>
			<TechnologyFilter />
			<LevelFilter />
			<Button variant="brandingInverse" className="mt-auto sm:hidden" onClick={closeSidebar}>
				Pokaż wyniki
			</Button>
			<CloseButton className="absolute top-1 right-1 sm:hidden" onClick={closeSidebar} />
		</aside>
	);
};
