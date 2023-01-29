"use client";

import { ChangeEvent } from "react";
import { useQuestionsOrderBy } from "../../hooks/useQuestionsOrderBy";
import { sortByLabels } from "../../lib/order";
import { Select } from "../Select/Select";

export const AnswersDashboardHeader = () => {
	const { sortBy, setSortByFromString } = useQuestionsOrderBy();

	const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
		event.preventDefault();
		setSortByFromString(event.target.value);
	};

	return (
		<header className="flex flex-wrap items-baseline justify-end gap-3 text-neutral-500 dark:text-neutral-400">
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
