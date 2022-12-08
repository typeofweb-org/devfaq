import { ComponentProps } from "react";
import { BaseModal } from "../BaseModal";
import { Button } from "../Button/Button";
import { Select } from "../Select/Select";
import { AddQuestionForm } from "./AddQuestionForm";
import { CloseAddQuestionModalButton } from "./CloseAddQuestionModalButton";

export const AddQuestionModal = (props: ComponentProps<typeof BaseModal>) => (
	<BaseModal {...props}>
		<h2 className="text-center text-xl font-bold uppercase text-primary">Nowe pytanie</h2>
		<AddQuestionForm>
			<div className="mt-10 flex flex-col gap-y-3 px-5 sm:flex-row sm:justify-evenly sm:gap-x-5">
				<label className="w-full">
					<Select className="w-full">
						<option>Wybierz Technologię</option>
						<option>HTML5</option>
						<option>JavaScript</option>
					</Select>
				</label>
				<label className="w-full">
					<Select className="w-full">
						<option>Wybierz Poziom</option>
						<option value="junior">junior</option>
						<option value="mid">Mid</option>
						<option value="senior">Senior</option>
					</Select>
				</label>
			</div>
			<textarea className="mt-4 h-40 w-full border"></textarea>
			<div className="mt-3 flex flex-col gap-2 sm:flex-row-reverse">
				<Button type="submit" variant="brandingInverse">
					Dodaj pytanie
				</Button>
				<CloseAddQuestionModalButton />
			</div>
		</AddQuestionForm>
	</BaseModal>
);
