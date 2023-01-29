import { redirect } from "next/navigation";
import { AnswersDashboard } from "../../../../components/AnswersDashboard/AnswersDashboard";
import { PrivateRoute } from "../../../../components/PrivateRoute";
import { Params, SearchParams } from "../../../../types";

export default function ManageQuestionsAnswers({ params }: { params: Params<"page"> }) {
	const page = Number.parseInt(params.page);

	if (Number.isNaN(page)) {
		return redirect("/user/questions");
	}

	return (
		<PrivateRoute loginPreviousPath="/">
			<AnswersDashboard page={page} />
		</PrivateRoute>
	);
}
