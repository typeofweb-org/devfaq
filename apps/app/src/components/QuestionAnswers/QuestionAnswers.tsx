import type { QuestionAnswer } from "../../types";
import { Answer } from "./Answer";
import { AddAnswerButton } from "./AddAnswerButton";

type QuestionAnswersProps = Readonly<{
	questionId: number;
	answers: QuestionAnswer[];
}>;

export const QuestionAnswers = ({ questionId, answers }: QuestionAnswersProps) => (
	<div className="mt-6">
		<h1 className="text-xl font-bold text-black dark:text-neutral-200">Odpowiedzi do pytania</h1>
		<div className="mt-4 flex flex-col gap-y-5">
			{answers.length > 0 ? (
				answers.map((answer) => <Answer key={answer.id} answer={answer} />)
			) : (
				<p className="font-bold text-neutral-700">
					Nikt nie udzielił jeszcze odpowiedzi na to pytanie!
				</p>
			)}
		</div>
		<AddAnswerButton questionId={questionId} />
	</div>
);
