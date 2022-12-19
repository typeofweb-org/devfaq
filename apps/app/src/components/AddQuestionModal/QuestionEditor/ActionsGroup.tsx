import { twMerge } from "tailwind-merge";
import type { ReactNode } from "react";
import type { Action } from "./QuestionEditor";

type ActionsGroupProps = Readonly<{
	separator?: boolean;
	children: ReactNode;
}>;

export const ActionsGroup = ({ separator = true, children }: ActionsGroupProps) => {
	return (
		<div
			className={twMerge("flex gap-x-1 pr-1.5", separator && "border-l border-neutral-300 pl-1.5")}
		>
			{children}
		</div>
	);
};

type ActionProps = Readonly<{
	icon: JSX.Element;
	disabled?: boolean;
	onClick: () => void;
}>;

const Action = ({ icon, disabled, onClick }: ActionProps) => (
	<button
		type="button"
		className="flex h-7 w-7 items-center justify-center rounded-sm border border-transparent bg-[#f0f0f0] fill-[#737373] p-1 hover:border-neutral-400 disabled:hover:border-transparent"
		onClick={onClick}
		disabled={disabled}
	>
		{icon}
	</button>
);

ActionsGroup.Action = Action;
