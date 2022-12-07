"use client";

import { useModal } from "../../hooks/useModal";
import { AddQuestionModal } from "../AddQuestionModal";
import { Button } from "../Button/Button";

export const AddQuestionButton = () => {
	const { isOpen, openModal, closeModal } = useModal();

	return (
		<>
			<Button variant="brandingInverse" className="hidden sm:inline-block" onClick={openModal}>
				Dodaj pytanie
			</Button>
			<AddQuestionModal isOpen={isOpen} onClose={closeModal} />
		</>
	);
};
