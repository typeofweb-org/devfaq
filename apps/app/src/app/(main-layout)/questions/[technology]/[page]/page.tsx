import { redirect } from "next/navigation";
import { QuestionItem } from "../../../../../components/QuestionItem/QuestionItem";
import { QuestionsHeader } from "../../../../../components/QuestionsHeader/QuestionsHeader";
import { QuestionsPagination } from "../../../../../components/QuestionsPagination";
import { PAGE_SIZE } from "../../../../../lib/constants";
import {
	DEFAULT_SORT_BY_QUERY,
	parseQuerySortBy,
	parseQueryLevels,
} from "../../../../../lib/order";
import { technologies } from "../../../../../lib/technologies";
import { getAllQuestions } from "../../../../../services/questions.service";
import { Params, SearchParams } from "../../../../../types";

export default async function QuestionsPage({
	params,
	searchParams,
}: {
	params: Params<"technology" | "page">;
	searchParams?: SearchParams<"sortBy" | "level">;
}) {
	const page = parseInt(params.page);
	const querySortBy = parseQuerySortBy(searchParams?.sortBy || DEFAULT_SORT_BY_QUERY);
	const levels = parseQueryLevels(searchParams?.level);

	if (!technologies.includes(params.technology) || isNaN(page)) {
		return redirect("/");
	}

	const { data } = await getAllQuestions({
		category: params.technology,
		limit: PAGE_SIZE,
		offset: (page - 1) * PAGE_SIZE,
		orderBy: querySortBy?.orderBy,
		order: querySortBy?.order,
		level: levels?.join(","),
	});

	return (
		<div className="flex flex-col gap-y-10">
			<QuestionsHeader technology={params.technology} total={data.meta.total} />
			{data.data.map(({ id, question, _levelId, acceptedAt, votesCount }) => (
				<QuestionItem
					key={id}
					title={question}
					level={_levelId}
					creationDate={new Date(acceptedAt || "")}
					votes={votesCount}
					voted={id % 2 === 0}
				/>
			))}
			<QuestionsPagination technology={params.technology} total={data.meta.total} />
		</div>
	);
}
