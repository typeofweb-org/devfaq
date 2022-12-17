"use client";

import { ChangeEvent } from "react";
import { technologiesLabel, Technology } from "../lib/technologies";
import { pluralize } from "../utils/intl";
import { useQuestionsOrderBy } from "../hooks/useQuestionsOrderBy";
import { sortByLabels } from "../lib/order";
import { Select } from "./Select/Select";

const questionsPluralize = pluralize("pytanie", "pytania", "pytań");

type QuestionsHeaderProps = Readonly<{
	technology: Technology;
	total: number;
}>;

export const QuestionsHeader = ({ technology, total }: QuestionsHeaderProps) => {
	const { sortBy, setSortByFromString } = useQuestionsOrderBy();

	const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
		event.preventDefault();
		setSortByFromString(event.target.value);
	};

	return (
		<header className="flex justify-between text-neutral-400">
			<output>
				<strong>{technologiesLabel[technology]}: </strong>
				{total} {questionsPluralize(total)}
			</output>
			<label>
				Sortuj według:
				<Select variant="default" value={sortBy} onChange={handleSelectChange} className="ml-3">
					{Object.entries(sortByLabels).map(([sortBy, label]) => (
						<option key={sortBy} value={sortBy}>
							{label}
						</option>
					))}
				</Select>
			</label>
		</header>
	);
};
