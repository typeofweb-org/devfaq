import { redirect } from "next/navigation";
import { AnswersDashboard } from "../../../../components/AnswersDashboard/AnswersDashboard";
import { PrivateRoute } from "../../../../components/PrivateRoute";
import { DEFAULT_ANSWERS_SORT_BY_QUERY, parseSortByQuery } from "../../../../lib/order";
import { Params, SearchParams } from "../../../../types";

export default function ManageQuestionsAnswers({
	params,
	searchParams,
}: {
	params: Params<"page">;
	searchParams: SearchParams<"sortBy">;
}) {
	const page = Number.parseInt(params.page);
	// const sortBy = parseAnswersQuerySortBy(searchParams?.sortBy || DEFAULT_ANSWERS_SORT_BY_QUERY);
	const sortBy = parseSortByQuery(searchParams?.sortBy || DEFAULT_ANSWERS_SORT_BY_QUERY);
	console.log(sortBy);

	if (Number.isNaN(page)) {
		return redirect("/answers/1");
	}

	return (
		<PrivateRoute loginPreviousPath="/">
			<AnswersDashboard page={page} order={sortBy?.order} orderBy={sortBy?.orderBy} />
		</PrivateRoute>
	);
}
