"use client";

import { useModalContext } from "../../providers/ModalProvider";
import { Button } from "../Button/Button";

export const AddQuestionButton = () => {
	const { openModal } = useModalContext();

	return (
		<>
			<Button
				variant="brandingInverse"
				className="hidden sm:inline-block"
				onClick={() => openModal("AddQuestionModal")}
			>
				Dodaj pytanie
			</Button>
		</>
	);
};
