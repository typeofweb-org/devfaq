import { use } from "react";
import { serializeAnswerToMarkdown } from "../../lib/answer";
import { APIAnswers } from "../../types";
import { Answer } from "../QuestionAnswers/Answer";

type AnswersListProps = Readonly<{
	answers: APIAnswers;
	refetchAnswers: () => void;
}>;

export const AnswersList = ({ answers, refetchAnswers }: AnswersListProps) => {
	const serializedAnswers = answers.map((answer) =>
		use(
			(async () => {
				const { mdxContent } = await serializeAnswerToMarkdown(answer);
				return { ...answer, mdxContent };
			})(),
		),
	);

	return (
		<div className="w-full space-y-5">
			{serializedAnswers.map((answer) => (
				<Answer key={answer.id} answer={answer} afterMutate={refetchAnswers} />
			))}
		</div>
	);
};
