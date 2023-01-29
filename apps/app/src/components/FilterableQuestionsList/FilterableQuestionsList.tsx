import { ComponentProps, ReactNode } from "react";
import { Order, OrderBy } from "../../lib/order";
import { QuestionStatus } from "../../lib/question";
import { Technology } from "../../lib/technologies";
import { Level } from "../QuestionItem/QuestionLevel";
import { QuestionsPagination } from "../QuestionsPagination/QuestionsPagination";
import { FilterableQuestionsListHeader } from "./FilterableQuestionsListHeader";

type FilterableQuestionsListProps = Readonly<{
	page: number;
	data: {
		status?: QuestionStatus;
		technology?: Technology | null;
		levels?: Level[] | null;
		order?: Order;
		orderBy?: OrderBy;
	};
	children: ReactNode;
}> &
	Omit<ComponentProps<typeof QuestionsPagination>, "current">;

export const FilterableQuestionsList = ({
	page,
	total,
	getHref,
	data,
	children,
}: FilterableQuestionsListProps) => (
	<div className="flex flex-1 flex-col items-center gap-6 py-6">
		<FilterableQuestionsListHeader {...data} />
		{children}
		<QuestionsPagination current={page} total={total} getHref={getHref} />
	</div>
);
