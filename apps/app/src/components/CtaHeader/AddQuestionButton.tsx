"use client";

import { useUIContext } from "../../providers/UIProvider";
import { Button } from "../Button/Button";

export const AddQuestionButton = () => {
	const { openModal } = useUIContext();

	return (
		<>
			<Button
				variant="brandingInverse"
				className="hidden sm:inline-block"
				onClick={() => openModal("AddQuestionModal")}
			>
				Dodaj pytanie
			</Button>
		</>
	);
};
