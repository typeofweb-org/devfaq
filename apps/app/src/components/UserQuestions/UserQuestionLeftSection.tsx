import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useUIContext } from "../../providers/UIProvider";
import { AdminQuestion } from "../../types";
import PencilIcon from "../../../public/icons/pencil.svg";
import { Button } from "../Button/Button";
import SelectIcon from "../../../public/select.svg";

type UserQuestionLeftSectionProps = Readonly<{
	question: AdminQuestion;
}>;

export const UserQuestionLeftSection = ({ question }: UserQuestionLeftSectionProps) => {
	const { openModal } = useUIContext();

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
				<Menu.Items className="absolute left-0 z-10 mt-1 w-36 origin-top-right divide-y divide-gray-100 rounded-md border-2 border-violet-100 bg-white text-violet-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-violet-700 dark:bg-violet-700">
					<div className="px-1 py-1 ">
						<Menu.Item>
							{({ active }) => (
								<button
									className={`group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-violet-100 focus:bg-violet-100 dark:text-white dark:hover:bg-violet-800 ${
										active ? "bg-violet-100" : ""
									}`}
									onClick={() => openModal("AddQuestionModal", question)}
								>
									<PencilIcon className="fill-violet-600 dark:fill-neutral-200" />
									Edytuj
								</button>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};
