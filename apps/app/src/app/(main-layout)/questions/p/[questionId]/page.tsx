import { redirect } from "next/navigation";
import { QuestionItem } from "../../../../../components/QuestionItem/QuestionItem";
import { getQuestionById } from "../../../../../services/questions.service";
import { Params } from "../../../../../types";

export default async function SingleQuestionPage({ params }: { params: Params<"questionId"> }) {
	const questionId = Number.parseInt(params.questionId);

	if (Number.isNaN(questionId)) {
		return redirect("/");
	}

	const {
		data: { data },
	} = await getQuestionById({
		id: questionId,
	});

	return (
		<QuestionItem
			id={data.id}
			title={data.question}
			level={data._levelId}
			creationDate={new Date(data.acceptedAt || "")}
			questionFilter={{}}
		/>
	);
}
