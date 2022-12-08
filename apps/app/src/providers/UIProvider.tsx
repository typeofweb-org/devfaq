"use client";

import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createSafeContext } from "../lib/createSafeContext";

export type Modal = "AddQuestionModal";

interface UIContextValue {
	openedModal: Modal | null;
	openModal: (modal: Modal) => void;
	closeModal: () => void;
	isSidebarOpen: boolean;
	openSidebar: () => void;
	closeSidebar: () => void;
}

const [useUIContext, UIContextProvider] = createSafeContext<UIContextValue>();

const UIProvider = ({ children }: { readonly children: ReactNode }) => {
	const [openedModal, setOpenedModal] = useState<Modal | null>(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const openModal = useCallback((modal: Modal) => {
		setOpenedModal(modal);
	}, []);

	const closeModal = useCallback(() => {
		setOpenedModal(null);
	}, []);

	const openSidebar = useCallback(() => {
		setIsSidebarOpen(true);
	}, []);

	const closeSidebar = useCallback(() => {
		setIsSidebarOpen(false);
	}, []);

	const value = useMemo(
		() => ({ openedModal, openModal, closeModal, isSidebarOpen, openSidebar, closeSidebar }),
		[openedModal, openModal, closeModal, isSidebarOpen, openSidebar, closeSidebar],
	);

	return <UIContextProvider value={value}>{children}</UIContextProvider>;
};

export { useUIContext, UIProvider };
