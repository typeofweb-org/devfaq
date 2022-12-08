"use client";

import { ComponentProps } from "react";
import type { FormEvent } from "react";
import { useModalContext } from "../providers/ModalProvider";
import { BaseModal } from "./BaseModal";
import { Button } from "./Button/Button";
import { Select } from "./Select/Select";

export const AddQuestionModal = (props: ComponentProps<typeof BaseModal>) => {
	const { closeModal } = useModalContext();

	const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	};

	return (
		<BaseModal {...props}>
			<h2 className="text-center text-xl font-bold uppercase text-primary">Nowe pytanie</h2>
			<form onSubmit={handleFormSubmit}>
				<div className="mt-10 flex flex-col gap-y-3 px-5 sm:flex-row sm:justify-evenly sm:gap-x-5">
					<Select className="w-full" aria-label="Wybierz technologię">
						<option>Wybierz Technologię</option>
						<option>HTML5</option>
						<option>JavaScript</option>
					</Select>
					<Select className="w-full" aria-label="Wybierz poziom">
						<option>Wybierz Poziom</option>
						<option value="junior">junior</option>
						<option value="mid">Mid</option>
						<option value="senior">Senior</option>
					</Select>
				</div>
				<textarea className="mt-4 h-40 w-full border"></textarea>
				<div className="mt-3 flex flex-col gap-2 sm:flex-row-reverse">
					<Button type="submit" variant="brandingInverse">
						Dodaj pytanie
					</Button>
					<Button variant="branding" onClick={closeModal}>
						Anuluj
					</Button>
				</div>
			</form>
		</BaseModal>
	);
};
