"use client";

import { useDevFAQRouter } from "../../hooks/useDevFAQRouter";
import { useUIContext } from "../../providers/UIProvider";
import { Button } from "../Button/Button";

export const AddQuestionButton = () => {
	const { openModal } = useUIContext();
	const { requireLoggedIn } = useDevFAQRouter();

	const handleButtonClick = () => openModal("AddQuestionModal");

	return (
		<>
			<Button
				variant="brandingInverse"
				className="hidden sm:inline-block"
				onClick={requireLoggedIn(handleButtonClick)}
			>
				Dodaj pytanie
			</Button>
		</>
	);
};
