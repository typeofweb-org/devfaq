"use client";

import { ChangeEvent, Fragment } from "react";
import { technologiesLabel, Technology } from "../lib/technologies";
import { pluralize } from "../utils/intl";
import { useQuestionsOrderBy } from "../hooks/useQuestionsOrderBy";
import { ordersBy, orders, sortByLabels } from "../lib/order";
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
					{ordersBy.map((orderBy) =>
						orders.map((order, i) => {
							const value = `${orderBy}*${order}` as const;

							return (
								<option key={i} value={value}>
									{sortByLabels[value]}
								</option>
							);
						}),
					)}
				</Select>
			</label>
		</header>
	);
};
