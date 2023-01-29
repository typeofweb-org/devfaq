"use client";

import { ReactNode, useState } from "react";
import { Button } from "../Button/Button";
import { QuestionAnswer, SingleAnswer } from "../../types";
import { useQuestionMutation } from "../../hooks/useQuestionMutation";
import { useUser } from "../../hooks/useUser";
import { AnswerForm } from "./AnswerForm/AnswerForm";

type EditAnswerProps = Readonly<{
	answer: QuestionAnswer | SingleAnswer;
	children: ReactNode;
	afterMutate?: () => void;
}>;

export const EditAnswer = ({
	answer: { id, content, sources, createdBy },
	children,
	afterMutate,
}: EditAnswerProps) => {
	const [isEditMode, setIsEditMode] = useState(false);
	const [isError, setIsError] = useState(false);

	const { userData } = useUser();
	const { patchQuestionAnswerMutation, deleteQuestionAnswerMutation } = useQuestionMutation();

	const handleDeleteButtonClick = () => {
		const confirmed = confirm("Czy na pewno chcesz usunąć tę odpowiedź?");

		if (!confirmed) return;

		deleteQuestionAnswerMutation.mutate(
			{ id },
			{
				onError: () => setIsError(true),
			},
		);

		if (afterMutate) {
			afterMutate();
		}
	};

	if (isEditMode) {
		return (
			<div className="mt-4">
				<AnswerForm
					title="Zapisz zmiany"
					initContent={content}
					initSources={sources}
					error={isError}
					onSubmit={async ({ content, sources }) => {
						await patchQuestionAnswerMutation.mutateAsync({ id, content, sources });
						setIsEditMode(false);
						if (afterMutate) {
							afterMutate();
						}
					}}
				>
					<Button type="button" variant="alert" onClick={handleDeleteButtonClick}>
						Usuń odpowiedź
					</Button>
					<Button type="button" variant="branding" onClick={() => setIsEditMode(false)}>
						Anuluj
					</Button>
				</AnswerForm>
			</div>
		);
	}

	return (
		<>
			{children}
			{userData?._user.id === createdBy.id || userData?._user._roleId === "admin" ? (
				<Button variant="branding" className="mt-2 w-full" onClick={() => setIsEditMode(true)}>
					Edytuj odpowiedź
				</Button>
			) : null}
		</>
	);
};
