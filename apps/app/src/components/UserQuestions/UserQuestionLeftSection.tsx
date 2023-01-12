import { useUIContext } from "../../providers/UIProvider";
import { AdminQuestion } from "../../types";
import PencilIcon from "../../../public/icons/pencil.svg";
import { Button } from "../Button/Button";

type UserQuestionLeftSectionProps = Readonly<{
	question: AdminQuestion;
}>;

export const UserQuestionLeftSection = ({ question }: UserQuestionLeftSectionProps) => {
	const { openModal } = useUIContext();

	return (
		<Button
			variant="branding"
			className="m-px my-auto flex h-fit w-24 min-w-0 items-center justify-center gap-2 p-0"
			onClick={() => openModal("AddQuestionModal", question)}
		>
			<PencilIcon className="fill-violet-700 dark:fill-neutral-200" />
			Edytuj
		</Button>
	);
};
