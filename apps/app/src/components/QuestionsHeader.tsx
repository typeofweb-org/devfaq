"use client";

import { ChangeEvent } from "react";
import { technologiesLabels, Technology } from "../lib/technologies";
import { pluralize } from "../utils/intl";
import { useQuestionsOrderBy } from "../hooks/useQuestionsOrderBy";
import { parseQuerySortBy } from "../lib/order";
import { SortBySelect } from "./SortBySelect";

const questionsPluralize = pluralize("pytanie", "pytania", "pytań");

type QuestionsHeaderProps = Readonly<{
	technology: Technology;
	total: number;
}>;

export const QuestionsHeader = ({ technology, total }: QuestionsHeaderProps) => {
	const { sortBy, setSortByFromString } = useQuestionsOrderBy();
	const sort = parseQuerySortBy(sortBy);

	const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
		event.preventDefault();
		setSortByFromString(event.target.value);
	};

	return (
		<header className="flex flex-wrap items-baseline justify-between gap-3 text-neutral-500 dark:text-neutral-400">
			<output className="flex gap-1.5 md:gap-3">
				<strong>{technologiesLabels[technology]}: </strong>
				{total} {questionsPluralize(total)}
			</output>
			{sort?.order && sort?.orderBy && (
				<SortBySelect order={sort.order} orderBy={sort.orderBy} onChange={handleSelectChange} />
			)}
		</header>
	);
};
