import { redirect } from "next/navigation";
import { QuestionItem } from "../../../../../components/QuestionsList/QuestionItem/QuestionItem";
import { QuestionsHeader } from "../../../../../components/QuestionsHeader";
import { QuestionsPagination } from "../../../../../components/QuestionsPagination";
import { PAGE_SIZE } from "../../../../../lib/constants";
import { DEFAULT_SORT_BY_QUERY, parseQuerySortBy } from "../../../../../lib/order";
import { parseQueryLevels } from "../../../../../lib/level";
import { technologies } from "../../../../../lib/technologies";
import { getAllQuestions } from "../../../../../services/questions.service";
import { Params, QuestionFilter, SearchParams } from "../../../../../types";
import { QuestionsList } from "../../../../../components/QuestionsList/QuestionsList";

export default async function QuestionsPage({
	params,
	searchParams,
}: {
	params: Params<"technology" | "page">;
	searchParams?: SearchParams<"sortBy" | "level">;
}) {
	const page = Number.parseInt(params.page);
	const sortBy = parseQuerySortBy(searchParams?.sortBy || DEFAULT_SORT_BY_QUERY);
	const levels = parseQueryLevels(searchParams?.level);

	if (!technologies.includes(params.technology) || Number.isNaN(page)) {
		return redirect("/");
	}

	const questionFilter: QuestionFilter = {
		category: params.technology,
		limit: PAGE_SIZE,
		offset: (page - 1) * PAGE_SIZE,
		orderBy: sortBy?.orderBy,
		order: sortBy?.order,
		level: levels?.join(","),
	};

	const { data } = await getAllQuestions(questionFilter);

	return (
		<div className="flex flex-col gap-y-10">
			<QuestionsHeader technology={params.technology} total={data.meta.total} />
			<QuestionsList questions={data.data} questionFilter={questionFilter} />
			<QuestionsPagination technology={params.technology} total={data.meta.total} />
		</div>
	);
}
