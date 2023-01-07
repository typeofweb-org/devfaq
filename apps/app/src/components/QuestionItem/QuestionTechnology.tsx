import { technologiesLabels, Technology } from "../../lib/technologies";
import { TechnologyIcon } from "../TechnologyIcon";

type QuestionTechnologyProps = Readonly<{
	technology: Technology;
}>;

export const QuestionTechnology = ({ technology }: QuestionTechnologyProps) => (
	<div className="mb-3 flex flex-col items-center self-center">
		<span className="text-sm text-neutral-600 dark:text-neutral-200">
			{technologiesLabels[technology]}
		</span>
		<TechnologyIcon technology={technology} className="mt-0.5 h-8 w-8" />
	</div>
);
