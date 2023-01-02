"use client";

import type { ComponentProps, ComponentType } from "react";
import { useUIContext } from "../providers/UIProvider";
import type { Modal } from "../providers/UIProvider";
import { AddQuestionModal } from "./AddQuestionModal";
import { AddQuestionConfirmationModal } from "./AddQuestionConfirmationModal";
import { BaseModal } from "./BaseModal/BaseModal";

const modals: Record<Modal, ComponentType<ComponentProps<typeof BaseModal>>> = {
	AddQuestionModal,
	AddQuestionConfirmationModal,
};

export const AppModals = () => {
	const { openedModal, closeModal } = useUIContext();

	return (
		<>
			{Object.entries(modals).map(([type, Modal]) => {
				return (
					<Modal key={type} isOpen={type === openedModal} onClose={closeModal} modalId={type} />
				);
			})}
		</>
	);
};
