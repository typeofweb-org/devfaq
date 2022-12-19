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

const actions = {
	BOLD: { open: "**", close: "**", icon: <BoldIcon viewBox="0 0 32 32" /> },
	ITALIC: { open: "_", close: "_", icon: <ItalicIcon viewBox="0 0 32 32" /> },
	HEADING: { open: "# ", close: "", icon: <HeadingIcon viewBox="0 0 24 24" /> },
	CODEBLOCK: { open: "```javascript\n", close: "\n```", icon: <CodeIcon viewBox="0 0 32 32" /> },
	UL: { open: "* ", close: "", icon: <OlIcon viewBox="0 0 32 32" /> },
	OL: { open: "1. ", close: "", icon: <UlIcon viewBox="0 0 32 32" /> },
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
		const { open, close } = actions[action];

		if (textarea) {
			const { selectionStart, selectionEnd } = textarea;

			const newValue =
				value.substring(0, selectionStart) +
				open +
				value.substring(selectionStart, selectionEnd) +
				close +
				value.substring(selectionEnd);

			selectionRef.current = {
				start: open.length + selectionStart,
				end: open.length + selectionEnd,
			};

			onChange(newValue);
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
	}, [value]);

	return (
		<div className="mt-4 rounded-md border">
			<div className="flex border-b p-2.5">
				{hierarchy.map((item, i) => (
					<ActionsGroup key={i} separator={i !== 0}>
						{item.map((action) => (
							<ActionsGroup.Action
								key={action}
								icon={actions[action].icon}
								onClick={handleActionClick(action)}
								disabled={isPreview}
							/>
						))}
					</ActionsGroup>
				))}
				<ActionsGroup>
					<ActionsGroup.Action icon={<EyeIcon />} onClick={() => setIsPreview((prev) => !prev)} />
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
