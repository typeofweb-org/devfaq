import { ChangeEvent } from "react";
import { useDevFAQRouter } from "../../hooks/useDevFAQRouter";
import { Order, answersSortByLabels, AnswersOrderBy } from "../../lib/order";
import { SortBySelect } from "../SortBySelect";

type FilterableAnswersListHeaderProps = Readonly<{
	order?: Order;
	orderBy?: AnswersOrderBy;
}>;

export const FilterableAnswersListHeader = ({
	order,
	orderBy,
}: FilterableAnswersListHeaderProps) => {
	const { mergeQueryParams } = useDevFAQRouter();

	const handleSelectChange = (param: string) => (event: ChangeEvent<HTMLSelectElement>) => {
		event.preventDefault();
		mergeQueryParams({ [param]: event.target.value });
	};

	return (
		<header className="flex w-full flex-wrap items-center justify-end gap-6 text-neutral-400">
			{order && orderBy && (
				<SortBySelect
					order={order}
					orderBy={orderBy}
					onChange={handleSelectChange("sortBy")}
					sortByLabels={answersSortByLabels}
				/>
			)}
		</header>
	);
};
