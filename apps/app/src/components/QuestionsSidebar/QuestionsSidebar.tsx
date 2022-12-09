"use client";

import { twMerge } from "tailwind-merge";
import { useUIContext } from "../../providers/UIProvider";
import { Button } from "../Button/Button";
import { CloseButton } from "../CloseButton/CloseButton";
import { LevelFilter } from "./LevelFilter/LevelFilter";
import { TechnologyFilter } from "./TechnologyFilter/TechnologyFilter";

export const QuestionsSidebar = () => {
	const { isSidebarOpen, closeSidebar } = useUIContext();

	return (
		<aside
			className={twMerge(
				"fixed top-0 left-0 bottom-0 right-0 z-[999] flex -translate-x-full transform-gpu flex-col bg-gray-50 px-2.5 pb-4 transition-transform duration-200 dark:bg-neutral-800",
				"after:absolute after:top-0 after:bottom-0 after:right-0 after:hidden after:w-px after:shadow-[4px_0px_4px_rgba(0,0,0,0.23)]",
				"sm:sticky sm:top-[56px] sm:h-screen sm:w-60 sm:translate-x-0 sm:p-0 sm:pr-10 sm:transition-none sm:after:inline",
				isSidebarOpen && "translate-x-0",
			)}
		>
			<TechnologyFilter />
			<LevelFilter />
			<Button variant="brandingInverse" className="mt-auto sm:hidden">
				Pokaż wyniki
			</Button>
			<CloseButton className="absolute top-1 right-1 sm:hidden" onClick={closeSidebar} />
		</aside>
	);
};
