"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useQuestionMutation } from "../../../hooks/useQuestionMutation";
import { Button } from "../../Button/Button";
import { WysiwygEditor } from "../../WysiwygEditor/WysiwygEditor";
import { URL_REGEX } from "../../../lib/constants";
import { Error } from "../../Error";
import { useRevalidation } from "../../../hooks/useRevalidation";
import { AnswerSources } from "./AnswerSources";

type AddAnswerFormProps = Readonly<{
	questionId: number;
}>;

export const AddAnswerForm = ({ questionId }: AddAnswerFormProps) => {
	const router = useRouter();

	const [content, setContent] = useState("");
	const [sources, setSources] = useState<string[]>([]);
	const [isError, setIsError] = useState(false);

	const { createQuestionAnswerMutation } = useQuestionMutation();
	const { revalidateMutation } = useRevalidation();

	const disabled =
		content.trim().length === 0 ||
		!sources.every((source) => URL_REGEX.test(source)) ||
		createQuestionAnswerMutation.isLoading ||
		revalidateMutation.isLoading;

	const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		createQuestionAnswerMutation.mutate(
			{
				id: questionId,
				sources,
				content,
			},
			{
				onSuccess: () => {
					revalidateMutation.mutate(`/questions/p/${questionId}`, {
						onSuccess: () => {
							router.refresh();
							setContent("");
							setSources([]);
						},
						onError: () => setIsError(true),
					});
				},
				onError: () => setIsError(true),
			},
		);
	};

	return (
		<div className="mt-6 bg-white p-5 dark:bg-white-dark">
			<h3 className="text-md font-bold dark:text-neutral-200">Dodaj odpowiedź</h3>
			<form onSubmit={handleFormSubmit}>
				<WysiwygEditor value={content} onChange={setContent} />
				<AnswerSources sources={sources} onChange={setSources} />
				<Button type="submit" variant="brandingInverse" className="mt-6 w-full" disabled={disabled}>
					Dodaj odpowiedź
				</Button>
			</form>
			<Error visible={isError} className="mt-2" />
		</div>
	);
};
