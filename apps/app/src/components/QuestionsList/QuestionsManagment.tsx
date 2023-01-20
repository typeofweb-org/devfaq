import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Button } from "../Button/Button";
import { PrivateElement } from "../PrivateElement";
import PencilIcon from "../../../public/icons/pencil.svg";
import { AdminQuestion } from "../../types";
import { useUIContext } from "../../providers/UIProvider";

export const QuestionsManagement = ({ question }: { question: AdminQuestion }) => {
	const { openModal } = useUIContext();

	const router = useRouter();
	const onQuestionUpdate = useCallback(() => {
		router.refresh();
	}, [router]);

	return (
		<PrivateElement role="admin">
			<div className="mr-3 flex flex-col justify-start gap-1.5">
				<Button
					variant="branding"
					className="m-px flex w-24 min-w-0 items-center justify-center gap-2 p-0"
					onClick={() =>
						openModal("AddQuestionModal", { ...question, customOnClose: onQuestionUpdate })
					}
				>
					<PencilIcon className="fill-violet-700 dark:fill-neutral-200" />
					Edytuj
				</Button>
			</div>
		</PrivateElement>
	);
};
