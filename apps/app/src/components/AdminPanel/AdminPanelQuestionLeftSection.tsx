import { twMerge } from "tailwind-merge";
import { QuestionStatus } from "../../lib/question";
import TrashIcon from "../../../public/icons/trash.svg";
import PencilIcon from "../../../public/icons/pencil.svg";
import CheckIcon from "../../../public/icons/check.svg";
import RejectIcon from "../../../public/icons/reject.svg";
import { Button } from "../Button/Button";
import { useQuestionMutation } from "../../hooks/useQuestionMutation";

type AdminPanelQuestionLeftSectionProps = Readonly<{
	id: number;
	status: QuestionStatus;
	refetchQuestions: () => void;
}>;

const buttonStyles = "w-24 gap-2 p-0 min-w-0 m-px flex items-center justify-center";

export const AdminPanelQuestionLeftSection = ({
	id,
	status,
	refetchQuestions,
}: AdminPanelQuestionLeftSectionProps) => {
	const { deleteQuestionMutation, patchQuestionMutation } = useQuestionMutation();

	const handleAcceptQuestionClick = () => {
		patchQuestionMutation.mutate(
			{
				id,
				status: "accepted",
			},
			{
				onSuccess: refetchQuestions,
			},
		);
	};

	const handleDeleteQuestionClick = (reject = false) => {
		const confirmed = confirm(`Czy na pewno chcesz ${reject ? "odrzucić" : "usunąć"} to pytanie?`);

		if (!confirmed) return;

		deleteQuestionMutation.mutate(
			{
				id,
			},
			{
				onSuccess: refetchQuestions,
			},
		);
	};

	return (
		<div className="mr-3 flex flex-col justify-between">
			<div className={twMerge("flex", status === "accepted" && "flex-col")}>
				<Button variant="branding" className={buttonStyles}>
					<PencilIcon className="fill-violet-700 dark:fill-neutral-200" />
					Edytuj
				</Button>
				{status === "accepted" && (
					<Button
						variant="brandingInverse"
						onClick={() => handleDeleteQuestionClick()}
						className={buttonStyles}
					>
						<TrashIcon className="fill-white" />
						Usuń
					</Button>
				)}
			</div>
			{status == "pending" && (
				<div className="flex">
					<Button
						variant="brandingInverse"
						onClick={handleAcceptQuestionClick}
						className={buttonStyles}
					>
						<CheckIcon />
						Akceptuj
					</Button>
					<Button
						variant="alert"
						onClick={() => handleDeleteQuestionClick(true)}
						className={buttonStyles}
					>
						<RejectIcon />
						Odrzuć
					</Button>
				</div>
			)}
		</div>
	);
};
