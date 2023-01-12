import { twMerge } from "tailwind-merge";
import { Fragment, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import TrashIcon from "../../../public/icons/trash.svg";
import PencilIcon from "../../../public/icons/pencil.svg";
import CheckIcon from "../../../public/icons/check.svg";
import RejectIcon from "../../../public/icons/reject.svg";
import { useQuestionMutation } from "../../hooks/useQuestionMutation";
import { useUIContext } from "../../providers/UIProvider";
import { AdminQuestion } from "../../types";
import SelectIcon from "../../../public/select.svg";

type AdminPanelQuestionLeftSectionProps = Readonly<{
	question: AdminQuestion;
	refetchQuestions: () => void;
}>;

export const AdminPanelQuestionLeftSection = ({
	question,
	refetchQuestions,
}: AdminPanelQuestionLeftSectionProps) => {
	const { deleteQuestionMutation, patchQuestionMutation } = useQuestionMutation();
	const { openModal, openedModal } = useUIContext();
	const { id, _statusId: status } = question;

	useEffect(() => {
		if (!openedModal) {
			refetchQuestions();
		}
	}, [openedModal, refetchQuestions]);

	const handleAcceptQuestionClick = () => {
		patchQuestionMutation.mutate(
			{ id, status: "accepted" },
			{
				onSuccess: refetchQuestions,
			},
		);
	};

	const handleDeleteQuestionClick = (reject = false) => {
		const confirmed = confirm(`Czy na pewno chcesz ${reject ? "odrzucić" : "usunąć"} to pytanie?`);

		if (!confirmed) return;

		deleteQuestionMutation.mutate({ id }, { onSuccess: refetchQuestions });
	};

	const handleEditQuestionClick = () => {
		openModal("AddQuestionModal", question);
	};

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 dark:bg-violet-700">
					Opcje
					<SelectIcon />
				</Menu.Button>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute left-0 z-10 mt-1 w-56 origin-top-right divide-y divide-gray-100 rounded-md border-2 border-violet-100 bg-white text-violet-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-violet-700 dark:bg-violet-700">
					<div className="px-1 py-1 ">
						<Menu.Item>
							<button
								className={`group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-violet-100 dark:text-white dark:hover:bg-violet-800`}
								onClick={handleEditQuestionClick}
							>
								<PencilIcon className="fill-violet-600 dark:fill-neutral-200" />
								Edytuj
							</button>
						</Menu.Item>
						<Menu.Item>
							<button
								className={`group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-green-500 hover:bg-green-100 dark:hover:bg-violet-800`}
							>
								<CheckIcon />
								Akceptuj
							</button>
						</Menu.Item>
						<Menu.Item>
							<button
								className={`group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-violet-800`}
							>
								<TrashIcon className="fill-red-500" />
								Odrzuć
							</button>
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
		// <div className="mr-3 flex flex-col justify-between">
		// 	<div className={twMerge("flex", status === "accepted" && "flex-col")}>
		// 		<Button variant="branding" className={buttonStyles} onClick={handleEditQuestionClick}>
		// 			<PencilIcon className="fill-violet-700 dark:fill-neutral-200" />
		// 			Edytuj
		// 		</Button>
		// 		{status === "accepted" && (
		// 			<Button
		// 				variant="brandingInverse"
		// 				onClick={() => handleDeleteQuestionClick()}
		// 				className={buttonStyles}
		// 			>
		// 				<TrashIcon className="fill-white" />
		// 				Usuń
		// 			</Button>
		// 		)}
		// 	</div>
		// 	{status == "pending" && (
		// 		<div className="flex">
		// 			<Button
		// 				variant="brandingInverse"
		// 				onClick={handleAcceptQuestionClick}
		// 				className={buttonStyles}
		// 			>
		// 				<CheckIcon />
		// 				Akceptuj
		// 			</Button>
		// 			<Button
		// 				variant="alert"
		// 				onClick={() => handleDeleteQuestionClick(true)}
		// 				className={buttonStyles}
		// 			>
		// 				<RejectIcon />
		// 				Odrzuć
		// 			</Button>
		// 		</div>
		// 	)}
		// </div>
	);
};
