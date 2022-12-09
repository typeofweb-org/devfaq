"use client";

import ActionIconFilter from "../../../public/icons/action-icon-filter.svg";
import ActionIconAdd from "../../../public/icons/action-icon-add.svg";
import { useUIContext } from "../../providers/UIProvider";
import { MobileActionButton } from "./MobileActionButton";

export const MobileActionButtons = () => {
	const { openSidebar, openModal } = useUIContext();

	return (
		<div className="sticky bottom-0 left-1/2 flex w-full justify-center gap-4 pb-7 sm:hidden">
			<MobileActionButton aria-label="Otwórz sidebar" onClick={openSidebar}>
				<ActionIconFilter />
			</MobileActionButton>
			<MobileActionButton
				aria-label="Dodaj nowe pytanie"
				onClick={() => openModal("AddQuestionModal")}
			>
				<ActionIconAdd />
			</MobileActionButton>
		</div>
	);
};
