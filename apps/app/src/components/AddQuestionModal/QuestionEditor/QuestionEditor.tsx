"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { twMerge } from "tailwind-merge";
import BoldIcon from "../../../../public/icons/toolbar-bold.svg";
import ItalicIcon from "../../../../public/icons/toolbar-italic.svg";
import HeadingIcon from "../../../../public/icons/toolbar-heading.svg";
import CodeIcon from "../../../../public/icons/toolbar-code.svg";
import UlIcon from "../../../../public/icons/toolbar-ul.svg";
import OlIcon from "../../../../public/icons/toolbar-ol.svg";
import EyeIcon from "../../../../public/icons/toolbar-eye.svg";
import { handleAction, Action } from "../../../lib/actions";
import { ActionsGroup } from "./ActionsGroup";
import { QuestionPreview } from "./QuestionPreview";
import { ActionItem } from "./ActionItem";

const actionIcons: Record<Action, JSX.Element> = {
	BOLD: <BoldIcon viewBox="0 0 32 32" />,
	ITALIC: <ItalicIcon viewBox="0 0 32 32" />,
	HEADING: <HeadingIcon viewBox="0 0 24 24" />,
	CODEBLOCK: <CodeIcon viewBox="0 0 32 32" />,
	UL: <UlIcon viewBox="0 0 32 32" />,
	OL: <OlIcon viewBox="0 0 32 32" />,
};

const hierarchy: Action[][] = [
	["BOLD", "ITALIC", "HEADING"],
	["CODEBLOCK", "UL", "OL"],
];

type QuestionEditorProps = Readonly<{
	value: string;
	onChange: (value: string) => void;
}>;

export const QuestionEditor = ({ value, onChange }: QuestionEditorProps) => {
	const [isPreview, setIsPreview] = useState(false);

	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
	const selectionRef = useRef<{ start: number; end: number } | null>(null);

	const handleActionClick = (action: Action) => () => {
		if (!textAreaRef.current) {
			return;
		}

		const { selectionStart, selectionEnd } = textAreaRef.current;
		const { start, end, newValue } = handleAction({ selectionStart, selectionEnd, value, action });

		selectionRef.current = {
			start,
			end,
		};

		onChange(newValue);
	};

	const handlePreviewButtonClick = () => {
		const { current } = textAreaRef;

		setIsPreview((prev) => !prev);

		if (current && !isPreview) {
			selectionRef.current = {
				start: current.selectionStart,
				end: current.selectionEnd,
			};
		}
	};

	useEffect(() => {
		const { current: textarea } = textAreaRef;
		const { current: selection } = selectionRef;

		if (textarea && selection) {
			textarea.focus();
			textarea.setSelectionRange(selection.start, selection.end);
			selectionRef.current = null;
		}
	}, [value, isPreview]);

	return (
		<div className="mt-4 rounded-md border">
			<div className="flex border-b p-2.5">
				{hierarchy.map((actions, i) => (
					<ActionsGroup key={i} separator={i !== 0}>
						{actions.map((action) => (
							<ActionItem
								key={action}
								onClick={handleActionClick(action)}
								icon={actionIcons[action]}
								disabled={isPreview}
							/>
						))}
					</ActionsGroup>
				))}
				<ActionsGroup>
					<ActionItem icon={<EyeIcon />} onClick={handlePreviewButtonClick} />
				</ActionsGroup>
			</div>
			<div className={twMerge("h-72 p-2", isPreview && "bg-neutral-50 dark:bg-neutral-700")}>
				{isPreview ? (
					<Suspense>
						<QuestionPreview content={value} />
					</Suspense>
				) : (
					<textarea
						aria-label="Wpisz treść pytania"
						className="h-full w-full resize-none bg-transparent focus:outline-0 dark:text-white"
						ref={textAreaRef}
						value={value}
						onChange={(event) => onChange(event.target.value)}
					/>
				)}
			</div>
		</div>
	);
};
