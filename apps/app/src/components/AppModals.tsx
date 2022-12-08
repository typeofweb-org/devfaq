"use client";

import type { ComponentProps, ComponentType } from "react";
import { useModalContext } from "../providers/ModalProvider";
import type { Modal } from "../providers/ModalProvider";
import { AddQuestionModal } from "./AddQuestionModal/AddQuestionModal";
import { BaseModal } from "./BaseModal";

const modals: Record<Modal, ComponentType<ComponentProps<typeof BaseModal>>> = {
	AddQuestionModal,
};

export const AppModals = () => {
	const { openedModal, closeModal } = useModalContext();

	return (
		<>
			{Object.entries(modals).map(([type, Modal]) => (
				<Modal key={type} isOpen={type === openedModal} onClose={closeModal} />
			))}
		</>
	);
};
