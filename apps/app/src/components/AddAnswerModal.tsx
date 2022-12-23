import { useRouter } from "next/navigation";
import { ComponentProps, FormEvent, useState } from "react";
import { useQuestionMutation } from "../hooks/useQuestionMutation";
import { useUIContext } from "../providers/UIProvider";
import { WysiwygEditor } from "./WysiwygEditor/WysiwygEditor";
import { BaseModal } from "./BaseModal/BaseModal";
import { Button } from "./Button/Button";

export const AddAnswerModal = (props: ComponentProps<typeof BaseModal>) => {
	const router = useRouter();

	const [content, setContent] = useState("");
	const [isError, setIsError] = useState(false);

	const { modalData, closeModal } = useUIContext<"AddAnswerModal">();
	const { createQuestionAnswerMutation } = useQuestionMutation();

	const isDisabled = content.length === 0 || createQuestionAnswerMutation.isLoading;

	const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!modalData) {
			return;
		}

		createQuestionAnswerMutation.mutate(
			{
				id: modalData.questionId,
				content,
			},
			{
				onSuccess: () => {
					router.refresh();
					setContent("");
					closeModal();
				},
				onError: () => setIsError(true),
			},
		);
	};

	return (
		<BaseModal {...props}>
			<BaseModal.Title>Dodaj odpowiedź</BaseModal.Title>
			<form onSubmit={handleFormSubmit}>
				<div className="mt-6 max-w-full">
					<WysiwygEditor value={content} onChange={setContent} />
				</div>
				<BaseModal.Footer>
					<Button type="submit" variant="brandingInverse" disabled={isDisabled}>
						Dodaj odpowiedź
					</Button>
					<Button type="button" variant="branding" onClick={closeModal}>
						Anuluj
					</Button>
				</BaseModal.Footer>
			</form>
			<BaseModal.Error visible={isError}>
				⚠️ Wystąpił nieoczekiwany błąd przy dodawaniu pytania. Spróbuj ponownie, a jeśli problem
				będzie się powtarzał,{" "}
				<a
					href="https://discord.com/invite/va2NhBv"
					className="underline"
					target="_blank"
					rel="noreferrer"
				>
					skontaktuj się z administracją.
				</a>
			</BaseModal.Error>
		</BaseModal>
	);
};
