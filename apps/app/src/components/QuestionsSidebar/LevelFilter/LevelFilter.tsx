"use client";

import { QuestionsSidebarSection } from "../QuestionsSidebarSection";
import { levels } from "../../../lib/level";
import { LevelFilterItem } from "./LevelFilterItem";

export const LevelFilter = () => (
	<QuestionsSidebarSection title="Wybierz poziom">
		<ul className="flex justify-center gap-3 sm:flex-col small-filters:flex-row">
			{levels.map((level) => (
				<li key={level}>
					<LevelFilterItem variant={level}>{level}</LevelFilterItem>
				</li>
			))}
		</ul>
	</QuestionsSidebarSection>
);
