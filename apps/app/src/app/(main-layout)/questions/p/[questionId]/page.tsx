import { redirect } from "next/navigation";
import { serializeSource } from "../../../../../lib/markdown";
import { QuestionAnswers } from "../../../../../components/QuestionAnswers/QuestionAnswers";
import { SingleQuestion } from "../../../../../components/SingleQuestion";
import { serializeQuestionToMarkdown } from "../../../../../lib/question";
import { getQuestionAnswers, getQuestionById } from "../../../../../services/questions.service";
import { Params } from "../../../../../types";

export default async function SingleQuestionPage({ params }: { params: Params<"questionId"> }) {
	const questionId = Number.parseInt(params.questionId);

	if (Number.isNaN(questionId)) {
		return redirect("/");
	}

	const [questionData, answersData] = await Promise.all([
		getQuestionById({
			id: questionId,
		}),
		getQuestionAnswers({ id: questionId }),
	]);

	const question = await serializeQuestionToMarkdown(questionData.data.data);
	const answers = await Promise.all(
		answersData.data.data.map(async ({ content, ...rest }) => {
			const mdxContent = await serializeSource(content);
			return { mdxContent, ...rest };
		}),
	);

	return (
		<>
			<SingleQuestion question={question} />
			<QuestionAnswers questionId={questionId} answers={answers} />
		</>
	);
}
