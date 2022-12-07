import { ReactNode, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { Portal } from "./Portal";

type BaseModalProps = Readonly<{
	isOpen: boolean;
	onClose: () => void;
	children?: ReactNode;
}>;

export const BaseModal = ({ isOpen, onClose, children }: BaseModalProps) => {
	return (
		<Portal>
			<Transition
				className="fixed top-0 left-0 z-[99] flex h-full w-full items-center justify-center bg-black/50"
				onClick={onClose}
				show={isOpen}
				enter="transition-opacity duration-200"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-100"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div
					className="relative rounded-sm bg-white px-11 py-20"
					onClick={(event) => event.stopPropagation()}
				>
					<button
						type="button"
						className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500"
						onClick={onClose}
					>
						x
					</button>
					{children}
				</div>
			</Transition>
		</Portal>
	);
};
