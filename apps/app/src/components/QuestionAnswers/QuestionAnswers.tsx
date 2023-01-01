import type { QuestionAnswer } from "../../types";
import { AddAnswerForm } from "./AddAnswerForm/AddAnswerForm";
import { AddAnswerTip } from "./AddAnswerTip";
import { Answer } from "./Answer";

type QuestionAnswersProps = Readonly<{
	questionId: number;
	answers: QuestionAnswer[];
}>;

export const QuestionAnswers = ({ questionId, answers }: QuestionAnswersProps) => (
	<div className="mt-6">
		<h2 className="text-xl font-bold text-black dark:text-neutral-200">Odpowiedzi do pytania</h2>
		<div className="mt-4 flex flex-col gap-y-5">
			{answers.length > 0 ? (
				answers.map((answer) => <Answer key={answer.id} answer={answer} />)
			) : (
				<p className="font-bold text-neutral-700 dark:text-neutral-300">
					Nikt nie udzielił jeszcze odpowiedzi na to pytanie!
				</p>
			)}
		</div>
		<AddAnswerTip>
			<AddAnswerForm questionId={questionId} />
		</AddAnswerTip>
	</div>
);
