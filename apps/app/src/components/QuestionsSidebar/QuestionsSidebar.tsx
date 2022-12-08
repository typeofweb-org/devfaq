"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../Button/Button";
import { LevelFilter } from "./LevelFilter/LevelFilter";
import { TechnologyFilter } from "./TechnologyFilter/TechnologyFilter";

export const QuestionsSidebar = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<aside
				className={twMerge(
					"fixed top-0 left-0 bottom-0 right-0 z-[999] flex -translate-x-full transform-gpu flex-col bg-gray-50 px-2.5 pb-4 dark:bg-neutral-800",
					"sm:sticky sm:top-[56px] sm:h-screen sm:w-60 sm:translate-x-0 sm:p-0 sm:pr-10 sm:transition-none",
					isOpen && "translate-x-0 transition-transform duration-200",
					!isOpen && "-translate-x-full transition-transform duration-200",
				)}
			>
				<TechnologyFilter />
				<LevelFilter />
				<Button variant="brandingInverse" className="mt-auto sm:hidden">
					Pokaż wyniki
				</Button>
			</aside>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="absolute top-12 right-0 z-[1000] flex h-8 w-8 items-center justify-center bg-red-400"
			>
				O
			</button>
		</>
	);
};
