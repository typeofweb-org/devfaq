import { redirect } from "next/navigation";
import { SingleQuestion } from "../../../../../components/SingleQuestion";
import { serializeQuestionToMarkdown } from "../../../../../lib/question";
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

	const question = await serializeQuestionToMarkdown(data);

	return <SingleQuestion question={question} />;
}
