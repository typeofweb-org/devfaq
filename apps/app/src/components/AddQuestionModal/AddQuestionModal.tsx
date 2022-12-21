"use client";

import { ChangeEvent, ComponentProps, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { twMerge } from "tailwind-merge";
import { useUIContext } from "../../providers/UIProvider";
import { technologiesLabel, Technology, validateTechnology } from "../../lib/technologies";
import { Level, levels, validateLevel } from "../../lib/level";
import { BaseModal } from "../BaseModal";
import { Button } from "../Button/Button";
import { Select } from "../Select/Select";
import { useQuestionMutation } from "../../hooks/useQuestionMutation";
import { QuestionEditor } from "./QuestionEditor/QuestionEditor";

type SelectDataState = Readonly<{
	technology?: Technology;
	level?: Level;
}>;

export const AddQuestionModal = (props: ComponentProps<typeof BaseModal>) => {
	const [selectData, setSelectData] = useState<SelectDataState>({});
	const [content, setContent] = useState("");
	const [isError, setIsError] = useState(false);

	const { openModal, closeModal, modalData, openedModal } = useUIContext<"AddQuestionModal">();
	const { createQuestionMutation, patchQuestionMutation } = useQuestionMutation();

	const disabled =
		!selectData.technology ||
		!selectData.level ||
		content.length === 0 ||
		createQuestionMutation.isLoading;

	useEffect(() => {
		if (openedModal && modalData) {
			setSelectData({
				level: modalData._levelId,
				technology: modalData._categoryId,
			});
			setContent(modalData.question);
		}
	}, [openedModal, modalData]);

	const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
		const { technology, level } = selectData;

		event.preventDefault();

		if (!technology || !level) {
			return;
		}

		const data = { category: technology, question: content, level };
		const options = {
			onSuccess: () => {
				setSelectData({});
				setContent("");
				modalData ? closeModal() : openModal("AddQuestionConfirmationModal");
			},
			onError: () => setIsError(true),
		};

		if (modalData) {
			patchQuestionMutation.mutate({ id: modalData.id, ...data }, options);
		} else {
			createQuestionMutation.mutate(data, options);
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
				{modalData ? "Edytuj" : "Nowe"} pytanie
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
							<option value="" disabled hidden>
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
							<option value="" disabled hidden>
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
						{modalData ? "Edytuj" : "Dodaj"} pytanie
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
