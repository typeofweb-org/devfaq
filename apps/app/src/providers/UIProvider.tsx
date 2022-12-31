import {
	createContext,
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import type { ReactNode } from "react";
import type { AdminQuestion } from "../types";

interface ModalData {
	AddQuestionModal: AdminQuestion;
	AddQuestionConfirmationModal: never;
}

export type Modal = keyof ModalData;

interface UIContextValue<D extends Modal = Modal> {
	openedModal: Modal | null;
	openModal: <T extends Modal>(modal: T, data?: ModalData[T]) => void;
	closeModal: () => void;
	modalData: ModalData[D] | null;
	isSidebarOpen: boolean;
	openSidebar: () => void;
	closeSidebar: () => void;
	isMenuOpen: boolean;
	setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const UIContext = createContext<UIContextValue | null>(null);

export const UIProvider = ({ children }: { readonly children: ReactNode }) => {
	const [openedModal, setOpenedModal] = useState<Modal | null>(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const modalDataRef = useRef<ModalData[Modal] | null>(null);

	const openModal = useCallback(<T extends Modal>(modal: T, data?: ModalData[T]) => {
		if (data) {
			modalDataRef.current = data;
		}

		setOpenedModal(modal);
	}, []);

	const closeModal = useCallback(() => {
		modalDataRef.current = null;
		setOpenedModal(null);
	}, []);

	const openSidebar = useCallback(() => {
		setIsSidebarOpen(true);
	}, []);

	const closeSidebar = useCallback(() => {
		setIsSidebarOpen(false);
	}, []);

	const value = useMemo(
		() => ({
			openedModal,
			openModal,
			closeModal,
			isSidebarOpen,
			openSidebar,
			closeSidebar,
			modalData: modalDataRef.current,
			isMenuOpen,
			setIsMenuOpen,
		}),
		[
			openedModal,
			openModal,
			closeModal,
			isSidebarOpen,
			openSidebar,
			closeSidebar,
			isMenuOpen,
			setIsMenuOpen,
		],
	);

	return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUIContext = <T extends Modal>() => {
	const ctx = useContext(UIContext);

	if (!ctx) {
		throw new Error("useContext must be use inside Provider!");
	}

	return ctx as UIContextValue<T>;
};
