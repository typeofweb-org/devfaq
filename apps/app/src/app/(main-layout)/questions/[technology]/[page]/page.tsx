import { redirect } from "next/navigation";
import { QuestionItem } from "../../../../../components/QuestionItem/QuestionItem";
import { QuestionsHeader } from "../../../../../components/QuestionsHeader/QuestionsHeader";
import { QuestionsPagination } from "../../../../../components/QuestionsPagination";
import { PAGE_SIZE } from "../../../../../lib/constants";
import { getQuerySortBy, DEFAULT_SORT_BY_QUERY } from "../../../../../lib/order";
import { technologies } from "../../../../../lib/technologies";
import { getAllQuestions } from "../../../../../services/questions.service";

export default async function QuestionsPage({
	params,
	searchParams,
}: {
	params: { technology: string; page: string };
	searchParams?: { sortBy?: string };
}) {
	const page = parseInt(params.page);
	const querySortBy = getQuerySortBy(searchParams?.sortBy || DEFAULT_SORT_BY_QUERY);

	if (!technologies.includes(params.technology) || isNaN(page)) {
		return redirect("/");
	}

	const { data } = await getAllQuestions({
		category: params.technology,
		limit: PAGE_SIZE,
		offset: (page - 1) * PAGE_SIZE,
		orderBy: querySortBy?.orderBy,
		order: querySortBy?.order,
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
				/>
			))}
			<QuestionsPagination technology={params.technology} total={data.meta.total} />
		</div>
	);
}
