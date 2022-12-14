"use client";

import { useQuestionsLevels } from "../../../hooks/useQuestionsLevels";
import { QuestionsSidebarSection } from "../QuestionsSidebarSection";
import { levels } from "../../../lib/order";
import { LevelButton } from "./LevelButton";

export const LevelFilter = () => {
	const { queryLevels, addLevel, removeLevel } = useQuestionsLevels();

	return (
		<QuestionsSidebarSection title="Wybierz poziom">
			<div className="flex justify-center gap-3 sm:flex-col small-filters:flex-row">
				{levels.map((level) => {
					const isActive = Boolean(queryLevels?.includes(level));
					const handleClick = isActive ? removeLevel : addLevel;

					return (
						<LevelButton
							key={level}
							variant={level}
							isActive={isActive}
							onClick={() => handleClick(level)}
						>
							{level}
						</LevelButton>
					);
				})}
			</div>
		</QuestionsSidebarSection>
	);
};
