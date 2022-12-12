"use client";

import { technologiesLabel, Technology } from "../../lib/technologies";
import { pluralize } from "../../utils/intl";
import { Select } from "../Select/Select";
import { useQuestionsHeader } from "./useQuestionsHeader";

const questionsPluralize = pluralize("pytanie", "pytania", "pytań");

type QuestionsHeaderProps = Readonly<{
	technology: Technology;
	total: number;
}>;

export const QuestionsHeader = ({ technology, total }: QuestionsHeaderProps) => {
	const { value, handleSelectChange } = useQuestionsHeader();

	return (
		<header className="flex justify-between text-neutral-400">
			<output>
				<strong>{technologiesLabel[technology]}: </strong>
				{total} {questionsPluralize(total)}
			</output>
			<label>
				Sortuj według:
				<Select variant="default" value={value} onChange={handleSelectChange} className="ml-3">
					<option value="acceptedAt*desc">od najnowszych</option>
					<option value="acceptedAt*asc">od najstarszych</option>
					<option value="votesCount*asc">od najmniej popularnych</option>
					<option value="votesCount*desc">od najpopularniejszych</option>
				</Select>
			</label>
		</header>
	);
};
