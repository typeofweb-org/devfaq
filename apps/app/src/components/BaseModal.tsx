"use client";

import { ReactNode, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { lockScroll, unlockScroll } from "../utils/pageScroll";
import { useUIContext } from "../providers/UIProvider";
import { CloseButton } from "./CloseButton/CloseButton";

type BaseModalProps = Readonly<{
	isOpen: boolean;
	onClose: () => void;
	children?: ReactNode;
}>;

export const BaseModal = ({ isOpen, onClose, children }: BaseModalProps) => {
	const { openedModal } = useUIContext();

	useEffect(() => {
		if (isOpen) {
			lockScroll();
		}
	}, [isOpen]);

	return (
		<Transition
			className="fixed top-0 left-0 z-50 h-full w-full overflow-y-auto bg-black/50 sm:p-2"
			onClick={onClose}
			show={isOpen}
			enter="transition-opacity duration-200"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition-opacity duration-100"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
			afterLeave={() => {
				if (!openedModal) {
					unlockScroll();
				}
			}}
		>
			<div className="m-auto flex min-h-full w-fit sm:items-center">
				<div
					className="relative w-full max-w-3xl animate-show rounded-sm bg-white px-3.5 py-9 dark:bg-white-dark sm:px-11 sm:py-20"
					onClick={(event) => {
						// stop propagation to avoid triggering `onClick` on the backdrop behind the modal
						event.stopPropagation();
					}}
				>
					<CloseButton
						type="button"
						aria-label="Zamknij modal"
						className="absolute right-4 top-4"
						onClick={onClose}
					/>
					{children}
				</div>
			</div>
		</Transition>
	);
};
