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
import { ActionsGroup } from "./ActionsGroup";
import { QuestionPreview } from "./QuestionPreview";
import { Action } from "./Action";

const actions = {
	BOLD: { open: "**", close: "**", newLine: false, icon: <BoldIcon viewBox="0 0 32 32" /> },
	ITALIC: { open: "_", close: "_", newLine: false, icon: <ItalicIcon viewBox="0 0 32 32" /> },
	HEADING: { open: "# ", close: "", newLine: true, icon: <HeadingIcon viewBox="0 0 24 24" /> },
	CODEBLOCK: {
		open: "```javascript\n",
		close: "\n```",
		newLine: true,
		icon: <CodeIcon viewBox="0 0 32 32" />,
	},
	UL: { open: "* ", close: "", newLine: true, icon: <UlIcon viewBox="0 0 32 32" /> },
	OL: { open: "1. ", close: "", newLine: true, icon: <OlIcon viewBox="0 0 32 32" /> },
};

const hierarchy: Action[][] = [
	["BOLD", "ITALIC", "HEADING"],
	["CODEBLOCK", "UL", "OL"],
];

export type Action = keyof typeof actions;

type QuestionEditorProps = Readonly<{
	value: string;
	onChange: (value: string) => void;
}>;

export const QuestionEditor = ({ value, onChange }: QuestionEditorProps) => {
	const [isPreview, setIsPreview] = useState(false);

	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
	const selectionRef = useRef<{ start: number; end: number } | null>(null);

	const handleActionClick = (action: Action) => () => {
		const { current: textarea } = textAreaRef;
		const { open, close, newLine } = actions[action];

		if (textarea) {
			const { selectionStart, selectionEnd } = textarea;

			const prevChar = value.substring(selectionStart - 1, selectionStart);
			const insertNewLine = newLine && prevChar !== "" && prevChar !== "\n";

			const newValue =
				value.substring(0, selectionStart) +
				`${insertNewLine ? "\n" : ""}${open}` +
				value.substring(selectionStart, selectionEnd) +
				close +
				value.substring(selectionEnd);

			const selection = open.length + (insertNewLine ? 1 : 0);

			selectionRef.current = {
				start: selection + selectionStart,
				end: selection + selectionEnd,
			};

			onChange(newValue);
		}
	};

	const handlePreviewButtonClick = () => {
		const { current: textarea } = textAreaRef;

		setIsPreview((prev) => !prev);

		if (textarea && !isPreview) {
			selectionRef.current = {
				start: textarea.selectionStart,
				end: textarea.selectionEnd,
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
				{hierarchy.map((item, i) => (
					<ActionsGroup key={i} separator={i !== 0}>
						{item.map((action) => (
							<Action
								key={action}
								icon={actions[action].icon}
								onClick={handleActionClick(action)}
								disabled={isPreview}
							/>
						))}
					</ActionsGroup>
				))}
				<ActionsGroup>
					<Action icon={<EyeIcon />} onClick={handlePreviewButtonClick} />
				</ActionsGroup>
			</div>
			<div className={twMerge("h-72 p-2", isPreview && "bg-neutral-50")}>
				{isPreview ? (
					<Suspense>
						<QuestionPreview content={value} />
					</Suspense>
				) : (
					<textarea
						aria-label="Wpisz treść pytania"
						className="h-full w-full resize-none focus:outline-0"
						ref={textAreaRef}
						value={value}
						onChange={(event) => onChange(event.target.value)}
					/>
				)}
			</div>
		</div>
	);
};
