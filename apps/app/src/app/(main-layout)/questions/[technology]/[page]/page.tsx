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
import { serializeSource } from "../../../../../lib/markdown";

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

	const { data } = await getAllQuestions({
		category: params.technology,
		limit: PAGE_SIZE,
		offset: (page - 1) * PAGE_SIZE,
		orderBy: sortBy?.orderBy,
		order: sortBy?.order,
		level: levels?.join(","),
	});

	const questions = await Promise.all(
		data.data.map(async ({ question, ...rest }) => {
			const mdxContent = await serializeSource(question);
			return { mdxContent, ...rest };
		}),
	);

	return (
		<div className="flex flex-col gap-y-10">
			<QuestionsHeader technology={params.technology} total={data.meta.total} />
			{questions.map(({ id, mdxContent, _levelId, acceptedAt, votesCount }) => (
				<QuestionItem
					key={id}
					mdxContent={mdxContent}
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
