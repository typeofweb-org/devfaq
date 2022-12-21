"use client";

import { useQuestionsLevels } from "../../../hooks/useQuestionsLevels";
import { QuestionsSidebarSection } from "../QuestionsSidebarSection";
import { levels } from "../../../lib/level";
import { LevelButton } from "./LevelButton";

export const LevelFilter = () => {
	const { queryLevels, addLevel, removeLevel } = useQuestionsLevels();

	return (
		<QuestionsSidebarSection title="Wybierz poziom">
			<ul className="flex justify-center gap-3 overflow-x-auto sm:flex-col small-filters:flex-row">
				{levels.map((level) => {
					const isActive = Boolean(queryLevels?.includes(level));
					const handleClick = isActive ? removeLevel : addLevel;

					return (
						<li key={level}>
							<LevelButton variant={level} isActive={isActive} onClick={() => handleClick(level)}>
								{level}
							</LevelButton>
						</li>
					);
				})}
			</ul>
		</QuestionsSidebarSection>
	);
};
