"use client";

import { ComponentProps } from "react";
import Logo from "../../public/typeofweb-logo.svg";
import { useUIContext } from "../providers/UIProvider";
import { BaseModal } from "./BaseModal";
import { Button } from "./Button/Button";

export const AddQuestionConfirmationModal = (props: ComponentProps<typeof BaseModal>) => {
	const { closeModal } = useUIContext();

	return (
		<BaseModal {...props}>
			<div className="flex flex-col items-center text-center text-primary">
				<p id="text-primary">
					Jeszcze momencik… a Twoje pytanie pojawi się na liście dostępnych pytań. Najpierw musimy
					rzucić na nie okiem i zatwierdzić.
					<br /> W międzyczasie zajrzyj na bloga ❤️
				</p>

				<a href="https://typeofweb.com/" target="_blank" rel="noreferrer">
					<div className="mt-7 h-32 w-32 rounded-md bg-white p-2 shadow-[0_0_10px] shadow-neutral-700/20 transition-colors hover:bg-neutral-50">
						<Logo className="h-full w-full" viewBox="0 0 400 400" />
					</div>
				</a>

				<Button type="button" variant="alternative" className="mt-8" onClick={closeModal}>
					OK!
				</Button>
			</div>
		</BaseModal>
	);
};
