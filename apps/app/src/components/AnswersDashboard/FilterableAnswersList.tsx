import { ComponentProps, ReactNode } from "react";
import { QuestionsPagination } from "../QuestionsPagination/QuestionsPagination";
import { FilterableAnswersListHeader } from "./FilterableAnswersListHeader";

type FilterableAnswersListProps = {
	page: number;
	children: ReactNode;
} & Omit<ComponentProps<typeof QuestionsPagination>, "current">;

export const FilterableAnswersList = ({
	page,
	total,
	getHref,
	children,
}: FilterableAnswersListProps) => {
	return (
		<div className="flex flex-1 flex-col items-center gap-6 py-6">
			<FilterableAnswersListHeader />
			{children}
			<QuestionsPagination current={page} total={total} getHref={getHref} />
		</div>
	);
};
