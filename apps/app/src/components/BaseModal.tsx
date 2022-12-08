"use client";

import { ReactNode, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { lockScroll, unlockScroll } from "../utils/pageScroll";
import { CloseButton } from "./CloseButton/CloseButton";

type BaseModalProps = Readonly<{
	isOpen: boolean;
	onClose: () => void;
	children?: ReactNode;
}>;

export const BaseModal = ({ isOpen, onClose, children }: BaseModalProps) => {
	useEffect(() => {
		isOpen && lockScroll();
	}, [isOpen]);

	return (
		<Transition
			className="fixed top-0 left-0 z-[99] flex h-full w-full items-center justify-center overflow-y-auto bg-black/50 sm:px-2"
			onClick={onClose}
			show={isOpen}
			enter="transition-opacity duration-200"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition-opacity duration-100"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
			afterLeave={() => {
				unlockScroll();
			}}
		>
			<div
				className="relative h-full w-full max-w-3xl animate-show rounded-sm bg-white px-3.5 py-9 sm:h-fit sm:px-11 sm:py-20"
				onClick={(event) => event.stopPropagation()}
			>
				<CloseButton
					type="button"
					aria-label="Zamknij modal"
					className="absolute right-4 top-4"
					onClick={onClose}
				/>
				{children}
			</div>
		</Transition>
	);
};
