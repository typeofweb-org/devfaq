"use client";

import { useQuestionMutation } from "../../hooks/useQuestionMutation";
import { AnswerForm } from "./AnswerForm/AnswerForm";

type AddAnswerProps = Readonly<{
	questionId: number;
}>;

export const AddAnswer = ({ questionId }: AddAnswerProps) => {
	const { createQuestionAnswerMutation } = useQuestionMutation();

	return (
		<div className="mt-6 bg-white p-5 dark:bg-white-dark">
			<AnswerForm
				title="Dodaj odpowiedź"
				onSubmit={async ({ content, sources }) => {
					await createQuestionAnswerMutation.mutateAsync({ id: questionId, content, sources });
				}}
			/>
		</div>
	);
};
