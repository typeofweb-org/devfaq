"use client";

import { useModalContext } from "../../providers/ModalProvider";
import { Button } from "../Button/Button";

export const CloseAddQuestionModalButton = () => {
	const { closeModal } = useModalContext();

	return (
		<Button variant="branding" onClick={closeModal}>
			Anuluj
		</Button>
	);
};
