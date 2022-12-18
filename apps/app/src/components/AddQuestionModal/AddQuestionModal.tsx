"use client";

import { ChangeEvent, ComponentProps, useState } from "react";
import type { FormEvent } from "react";
import { twMerge } from "tailwind-merge";
import { useUIContext } from "../../providers/UIProvider";
import { technologiesLabel, Technology, validateTechnology } from "../../lib/technologies";
import { Level, levels, validateLevel } from "../../lib/level";
import { BaseModal } from "../BaseModal";
import { Button } from "../Button/Button";
import { Select } from "../Select/Select";
import { useCreateQuestion } from "../../hooks/useCreateQuestion";
import { QuestionEditor } from "./QuestionEditor";

type SelectDataState = Readonly<{
	technology?: Technology;
	level?: Level;
}>;

export const AddQuestionModal = (props: ComponentProps<typeof BaseModal>) => {
	const [selectData, setSelectData] = useState<SelectDataState>({});
	const [content, setContent] = useState("");
	const [isError, setIsError] = useState(false);

	const { openModal, closeModal } = useUIContext();
	const { createQuestionMutation } = useCreateQuestion();

	const disabled =
		!selectData.technology ||
		!selectData.level ||
		content.length === 0 ||
		createQuestionMutation.isLoading;

	const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
		const { technology, level } = selectData;

		event.preventDefault();

		if (technology && level) {
			createQuestionMutation.mutate(
				{
					category: technology,
					question: content,
					level,
				},
				{
					onSuccess: () => {
						setSelectData({});
						setContent("");
						openModal("AddQuestionConfirmationModal");
					},
					onError: () => setIsError(true),
				},
			);
		}
	};

	const handleSelectChange =
		(key: keyof SelectDataState, validator: (value: string) => boolean) =>
		(event: ChangeEvent<HTMLSelectElement>) => {
			const { value } = event.target;

			event.preventDefault();

			if (validator(value)) {
				setSelectData((prev) => ({ ...prev, [key]: value }));
			}
		};

	return (
		<BaseModal {...props}>
			<h2 className="text-center text-xl font-bold uppercase text-primary dark:text-neutral-200">
				Nowe pytanie
			</h2>
			<form onSubmit={handleFormSubmit}>
				<div className="mt-10 flex flex-col gap-y-3 px-5 sm:flex-row sm:justify-evenly sm:gap-x-5">
					<label className="flex w-full flex-col gap-2">
						<span className="text-sm text-violet-700 dark:text-neutral-200">
							Wybierz technologię:
						</span>
						<Select
							variant="purple"
							value={selectData.technology || ""}
							onChange={handleSelectChange("technology", validateTechnology)}
						>
							<option value="" disabled hidden selected>
								-
							</option>
							{Object.entries(technologiesLabel).map(([technology, label]) => (
								<option key={technology} value={technology}>
									{label}
								</option>
							))}
						</Select>
					</label>
					<label className="flex w-full flex-col gap-2">
						<span className="text-sm text-violet-700 dark:text-neutral-200">Wybierz poziom:</span>
						<Select
							variant="purple"
							value={selectData.level || ""}
							onChange={handleSelectChange("level", validateLevel)}
						>
							<option value="" disabled hidden selected>
								-
							</option>
							{levels.map((level) => (
								<option key={level} value={level}>
									{level}
								</option>
							))}
						</Select>
					</label>
				</div>
				<QuestionEditor value={content} onChange={setContent} />
				<div className="mt-3 flex flex-col gap-2 sm:flex-row-reverse">
					<Button type="submit" variant="brandingInverse" disabled={disabled}>
						Dodaj pytanie
					</Button>
					<Button type="button" variant="branding" onClick={closeModal}>
						Anuluj
					</Button>
				</div>
				<p
					className={twMerge("-mb-10 mt-3 text-red-600", isError ? "visible" : "invisible")}
					role="alert"
				>
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
				</p>
			</form>
		</BaseModal>
	);
};
