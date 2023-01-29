import { redirect } from "next/navigation";
import { PrivateRoute } from "../../../../components/PrivateRoute";
import { Params, SearchParams } from "../../../../types";

export default function ManageQuestionsAnswers({
	params,
	searchParams,
}: {
	params: Params<"page">;
	searchParams?: SearchParams<"technology" | "level">;
}) {
	const page = Number.parseInt(params.page);

	if (Number.isNaN(page)) {
		return redirect("/user/questions");
	}

	console.log();

	return <PrivateRoute loginPreviousPath="/">manage questions answers</PrivateRoute>;
}
