"use client";

import { QuestionsSidebarSection } from "../QuestionsSidebarSection";
import { levels } from "../../../lib/level";
import { LevelFilterItem } from "./LevelFilterItem";

export const LevelFilter = () => (
	<QuestionsSidebarSection title="Wybierz poziom">
		<ul className="flex justify-center gap-x-4 overflow-x-auto pb-4 sm:flex-col sm:flex-wrap sm:justify-between sm:gap-x-0 sm:gap-y-3 sm:overflow-x-visible sm:p-0 small-filters:flex-row small-filters:gap-y-4">
			{levels.map((level) => (
				<li key={level} className="pt-1">
					<LevelFilterItem variant={level}>{level}</LevelFilterItem>
				</li>
			))}
		</ul>
	</QuestionsSidebarSection>
);
