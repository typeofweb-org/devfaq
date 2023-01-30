import { ChangeEvent } from "react";
import { AnswersOrderBy, answersSortByLabels, Order, OrderBy, sortByLabels } from "../lib/order";
import { Select } from "./Select/Select";
import { SelectLabel } from "./SelectLabel";

type SortBySelectProps = {
	order: Order;
	orderBy: OrderBy | AnswersOrderBy;
	sortByLabels: typeof sortByLabels | typeof answersSortByLabels;
	onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export const SortBySelect = ({ order, orderBy, sortByLabels, onChange }: SortBySelectProps) => (
	<SelectLabel>
		Sortowanie:
		<Select variant="default" value={`${orderBy}*${order}`} onChange={onChange}>
			{Object.entries(sortByLabels).map(([sortBy, label]) => (
				<option key={sortBy} value={sortBy}>
					{label}
				</option>
			))}
		</Select>
	</SelectLabel>
);
