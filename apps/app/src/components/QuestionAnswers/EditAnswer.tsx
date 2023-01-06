"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../Button/Button";
import { QuestionAnswer } from "../../types";
import { useQuestionMutation } from "../../hooks/useQuestionMutation";
import { useUser } from "../../hooks/useUser";
import { AnswerForm } from "./AnswerForm/AnswerForm";

type EditAnswerProps = Readonly<{
	answer: QuestionAnswer;
	children: ReactNode;
}>;

export const EditAnswer = ({
	answer: { id, content, sources, createdBy },
	children,
}: EditAnswerProps) => {
	const router = useRouter();

	const [isEditMode, setIsEditMode] = useState(false);
	const [isError, setIsError] = useState(false);

	const { userData } = useUser();
	const { updateQuestionAnswerMutation, deleteQuestionAnswerMutation } = useQuestionMutation();

	const handleDeleteButtonClick = () => {
		const confirmed = confirm("Czy na pewno chcesz usunąć tę odpowiedź?");

		if (!confirmed) return;

		deleteQuestionAnswerMutation.mutate(
			{ id },
			{
				onError: () => setIsError(true),
			},
		);
		router.refresh();
	};

	if (isEditMode) {
		return (
			<div className="mt-4">
				<AnswerForm
					title="Edytuj odpowiedź"
					initContent={content}
					initSources={sources}
					error={isError}
					onSubmit={async ({ content, sources }) => {
						await updateQuestionAnswerMutation.mutateAsync({ id, content, sources });
						setIsEditMode(false);
					}}
				>
					<Button type="button" variant="brandingInverse" onClick={handleDeleteButtonClick}>
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
