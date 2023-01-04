"use client";

import { ChangeEvent, ComponentProps, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useUIContext } from "../providers/UIProvider";
import { technologiesLabels, Technology, validateTechnology } from "../lib/technologies";
import { Level, levels, validateLevel } from "../lib/level";
import { useQuestionMutation } from "../hooks/useQuestionMutation";
import { BaseModal } from "./BaseModal/BaseModal";
import { Button } from "./Button/Button";
import { Select } from "./Select/Select";
import { WysiwygEditor } from "./WysiwygEditor/WysiwygEditor";

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
		content.trim().length === 0 ||
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
			<BaseModal.Title modalId={props.modalId}>
				{modalData ? "Edytuj" : "Nowe"} pytanie
			</BaseModal.Title>
			<form onSubmit={handleFormSubmit}>
				<div className="mt-10 flex flex-col gap-y-3 sm:flex-row sm:justify-evenly sm:gap-x-5">
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
							{Object.entries(technologiesLabels).map(([technology, label]) => (
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
				<WysiwygEditor value={content} onChange={setContent} />
				<BaseModal.Footer>
					<Button type="submit" variant="brandingInverse" disabled={disabled}>
						{modalData ? "Edytuj" : "Dodaj"} pytanie
					</Button>
					<Button type="button" variant="branding" onClick={closeModal}>
						Anuluj
					</Button>
				</BaseModal.Footer>
				<BaseModal.Error visible={isError} />
			</form>
		</BaseModal>
	);
};
