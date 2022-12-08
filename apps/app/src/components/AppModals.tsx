"use client";

import type { ComponentProps, ComponentType } from "react";
import { useUIContext } from "../providers/UIProvider";
import type { Modal } from "../providers/UIProvider";
import { AddQuestionModal } from "./AddQuestionModal";
import { BaseModal } from "./BaseModal";

const modals: Record<Modal, ComponentType<ComponentProps<typeof BaseModal>>> = {
	AddQuestionModal,
};

export const AppModals = () => {
	const { openedModal, closeModal } = useUIContext();

	return (
		<>
			{Object.entries(modals).map(([type, Modal]) => (
				<Modal key={type} isOpen={type === openedModal} onClose={closeModal} />
			))}
		</>
	);
};
