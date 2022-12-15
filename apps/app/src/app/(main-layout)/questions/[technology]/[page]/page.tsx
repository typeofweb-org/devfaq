import { redirect } from "next/navigation";
import { QuestionItem } from "../../../../../components/QuestionItem/QuestionItem";
import { QuestionsHeader } from "../../../../../components/QuestionsHeader";
import { QuestionsPagination } from "../../../../../components/QuestionsPagination";
import { PAGE_SIZE } from "../../../../../lib/constants";
import { DEFAULT_SORT_BY_QUERY, parseQuerySortBy } from "../../../../../lib/order";
import { parseQueryLevels } from "../../../../../lib/level";
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
	const page = Number.parseInt(params.page);
	const sortBy = parseQuerySortBy(searchParams?.sortBy || DEFAULT_SORT_BY_QUERY);
	const levels = parseQueryLevels(searchParams?.level);

	if (!technologies.includes(params.technology) || Number.isNaN(page)) {
		return redirect("/");
	}

	const { technology } = params;
	const { data } = await getAllQuestions({
		category: technology,
		limit: PAGE_SIZE,
		offset: (page - 1) * PAGE_SIZE,
		orderBy: sortBy?.orderBy,
		order: sortBy?.order,
		level: levels?.join(","),
	});

	return (
		<div className="flex flex-col gap-y-10">
			<QuestionsHeader technology={params.technology} total={data.meta.total} />
			{data.data.map(({ id, question, _levelId, acceptedAt }) => (
				<QuestionItem
					key={id}
					id={id}
					title={question}
					level={_levelId}
					creationDate={new Date(acceptedAt || "")}
					technology={technology}
					page={page}
				/>
			))}
			<QuestionsPagination technology={params.technology} total={data.meta.total} />
		</div>
	);
}
