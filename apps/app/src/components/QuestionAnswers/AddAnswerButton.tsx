"use client";

import { useDevFAQRouter } from "../../hooks/useDevFAQRouter";
import { useUIContext } from "../../providers/UIProvider";
import { Button } from "../Button/Button";

type AddAnswerButtonProps = Readonly<{
	questionId: number;
}>;

export const AddAnswerButton = ({ questionId }: AddAnswerButtonProps) => {
	const { openModal } = useUIContext();
	const { requireLoggedIn } = useDevFAQRouter();

	const handleButtonClick = () => openModal("AddAnswerModal", { questionId });

	return (
		<Button
			type="button"
			variant="brandingInverse"
			className="mt-6 w-full"
			onClick={requireLoggedIn(handleButtonClick)}
		>
			Dodaj odpowiedź
		</Button>
	);
};
