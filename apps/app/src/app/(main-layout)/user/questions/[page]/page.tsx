import { redirect } from "next/navigation";
import { PrivateRoute } from "../../../../../components/PrivateRoute";
import { UserQuestions } from "../../../../../components/UserQuestions/UserQuestions";
import { parseQueryLevels } from "../../../../../lib/level";
import { parseTechnologyQuery } from "../../../../../lib/technologies";
import { Params, SearchParams } from "../../../../../types";

export default function UserQuestionsPage({
	params,
	searchParams,
}: {
	params: Params<"page">;
	searchParams?: SearchParams<"technology" | "level">;
}) {
	const page = Number.parseInt(params.page);
	const technology = parseTechnologyQuery(searchParams?.technology);
	const levels = parseQueryLevels(searchParams?.level);

	if (Number.isNaN(page)) {
		return redirect("/user/questions");
	}

	return (
		<PrivateRoute loginPreviousPath="/">
			<UserQuestions page={page} technology={technology} levels={levels} />
		</PrivateRoute>
	);
}
