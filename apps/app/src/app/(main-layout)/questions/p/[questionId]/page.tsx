import { redirect } from "next/navigation";
import { serializeSource } from "../../../../../lib/markdown";
import { QuestionAnswers } from "../../../../../components/QuestionAnswers/QuestionAnswers";
import { SingleQuestion } from "../../../../../components/SingleQuestion";
import { serializeQuestionToMarkdown } from "../../../../../lib/question";
import { getQuestionAnswers, getQuestionById } from "../../../../../services/questions.service";
import { Params } from "../../../../../types";
import { isFlagEnabled } from "../../../../../services/flagsmith.service";

export default async function SingleQuestionPage({ params }: { params: Params<"questionId"> }) {
	const questionId = Number.parseInt(params.questionId);

	if (Number.isNaN(questionId)) {
		return redirect("/");
	}

	const [questionData, answersData, questionAnswersEnabled] = await Promise.all([
		getQuestionById({
			id: questionId,
		}),
		getQuestionAnswers({ id: questionId }),
		isFlagEnabled("question_answers"),
	]);

	const question = await serializeQuestionToMarkdown(questionData.data.data);

	if (!questionAnswersEnabled) {
		return <SingleQuestion question={question} />;
	}

	const answers = await Promise.all(
		answersData.data.data.map(async (answer) => {
			const mdxContent = await serializeSource(answer.content);
			return { mdxContent, ...answer };
		}),
	);

	return (
		<>
			<SingleQuestion question={question} />
			<QuestionAnswers questionId={questionId} answers={answers} />
		</>
	);
}

export async function generateStaticParams() {
	return [];
}
