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
		<header className="flex flex-wrap items-baseline justify-between gap-3 text-neutral-400">
			<output className="flex gap-1.5 md:gap-3">
				<strong>{technologiesLabel[technology]}: </strong>
				{total} {questionsPluralize(total)}
			</output>
			<label className="flex flex-wrap items-baseline gap-1.5 md:gap-3">
				Sortuj według:
				<Select variant="default" value={sortBy} onChange={handleSelectChange}>
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
