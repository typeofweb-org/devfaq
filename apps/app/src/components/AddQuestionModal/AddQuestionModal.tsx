import { ComponentProps } from "react";
import { BaseModal } from "../BaseModal";
import { Button } from "../Button/Button";
import { Select } from "../Select/Select";
import { CloseAddQuestionModalButton } from "./CloseAddQuestionModalButton";

export const AddQuestionModal = (props: ComponentProps<typeof BaseModal>) => (
	<BaseModal {...props}>
		<h3 className="text-center text-xl font-bold uppercase text-primary">Nowe pytanie</h3>
		<div className="mt-10 flex flex-col gap-y-3 px-5 sm:flex-row sm:justify-evenly sm:gap-x-5">
			<Select className="w-full">
				<option>Wybierz Technologię</option>
				<option>HTML5</option>
				<option>JavaScript</option>
			</Select>
			<Select className="w-full">
				<option>Wybierz Poziom</option>
				<option>junior</option>
				<option>Mid</option>
				<option>Senior</option>
			</Select>
		</div>
		<textarea className="mt-4 h-40 w-full border"></textarea>
		<div className="mt-3 flex flex-col gap-2 sm:flex-row-reverse">
			<Button variant="brandingInverse">Dodaj pytanie</Button>
			<CloseAddQuestionModalButton />
		</div>
	</BaseModal>
);
