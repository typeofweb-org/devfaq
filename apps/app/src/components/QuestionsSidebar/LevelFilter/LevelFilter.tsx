import { QuestionsSidebarSection } from "../QuestionsSidebarSection";
import { LevelButton } from "./LevelButton";

export const LevelFilter = () => {
	return (
		<QuestionsSidebarSection title="Wybierz poziom">
			<div className="flex justify-center gap-3 sm:flex-col small-filters:flex-row">
				<LevelButton variant="junior" isActive={true}>
					Junior
				</LevelButton>
				<LevelButton variant="mid" isActive={false}>
					Mid
				</LevelButton>
				<LevelButton variant="senior" isActive={false}>
					Senior
				</LevelButton>
			</div>
		</QuestionsSidebarSection>
	);
};
