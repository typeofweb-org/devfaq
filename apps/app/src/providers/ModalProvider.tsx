"use client";

import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { createSafeContext } from "../lib/createSafeContext";

export type Modal = "AddQuestionModal";

interface ModalContextValue {
	openedModal: Modal | null;
	openModal: (modal: Modal) => void;
	closeModal: () => void;
}

const [useModalContext, ModalContextProvider] = createSafeContext<ModalContextValue>();

const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [openedModal, setOpenedModal] = useState<Modal | null>(null);

	const openModal = useCallback((modal: Modal) => {
		setOpenedModal(modal);
	}, []);

	const closeModal = useCallback(() => {
		setOpenedModal(null);
	}, []);

	return (
		<ModalContextProvider value={{ openedModal, openModal, closeModal }}>
			{children}
		</ModalContextProvider>
	);
};

export { useModalContext, ModalProvider };
