"use client";

import { useEffect, useRef, useState, Suspense, memo } from "react";
import dynamic from "next/dynamic";
import BoldIcon from "../../../public/icons/toolbar-bold.svg";
import ItalicIcon from "../../../public/icons/toolbar-italic.svg";
import HeadingIcon from "../../../public/icons/toolbar-heading.svg";
import CodeIcon from "../../../public/icons/toolbar-code.svg";
import UlIcon from "../../../public/icons/toolbar-ul.svg";
import OlIcon from "../../../public/icons/toolbar-ol.svg";
import EyeIcon from "../../../public/icons/toolbar-eye.svg";
import { handleAction, Action } from "../../lib/actions";
import { Loading } from "../Loading";
import { ActionsGroup } from "./ActionsGroup";
import { ActionItem } from "./ActionItem";

const ContentPreview = dynamic(
	() =>
		import(/* webpackChunkName: "ContentPreview" */ "./ContentPreview").then(
			(mod) => mod.ContentPreview,
		),
	{
		ssr: false,
	},
);

const actionIcons: Record<Action, JSX.Element> = {
	BOLD: <BoldIcon viewBox="0 0 32 32" />,
	ITALIC: <ItalicIcon viewBox="0 0 32 32" />,
	HEADING: <HeadingIcon viewBox="0 0 24 24" />,
	CODEBLOCK: <CodeIcon viewBox="0 0 32 32" />,
	UL: <UlIcon viewBox="0 0 32 32" />,
	OL: <OlIcon viewBox="0 0 32 32" />,
};

const actionLabels: Record<Action, string> = {
	BOLD: "wstaw pogrubienie",
	ITALIC: "wstaw italik",
	HEADING: "wstaw nagłówek",
	CODEBLOCK: "wstaw blok kodu",
	UL: "wstaw listę nieuporządkowaną",
	OL: "wstaw listę uporządkowaną",
};

const hierarchy: Action[][] = [
	["BOLD", "ITALIC", "HEADING"],
	["CODEBLOCK", "UL", "OL"],
];

type WysiwygEditorProps = Readonly<{
	value: string;
	onChange: (value: string) => void;
}>;

export const WysiwygEditor = memo(({ value, onChange }: WysiwygEditorProps) => {
	const [isPreview, setIsPreview] = useState(false);

	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
	const selectionRef = useRef<{ start: number; end: number } | null>(null);

	const handleActionClick = (action: Action) => () => {
		if (!textAreaRef.current) {
			return;
		}

		const {
			selection: { start, end },
			newValue,
		} = handleAction({
			selection: {
				start: textAreaRef.current.selectionStart,
				end: textAreaRef.current.selectionEnd,
			},
			value,
			action,
		});

		selectionRef.current = {
			start,
			end,
		};

		onChange(newValue);
	};

	const handlePreviewButtonClick = () => {
		setIsPreview((prev) => !prev);

		if (textAreaRef.current && !isPreview) {
			selectionRef.current = {
				start: textAreaRef.current.selectionStart,
				end: textAreaRef.current.selectionEnd,
			};
		}
	};

	useEffect(() => {
		if (textAreaRef.current && selectionRef.current) {
			textAreaRef.current.focus();
			textAreaRef.current.setSelectionRange(selectionRef.current.start, selectionRef.current.end);
			selectionRef.current = null;
		}
	}, [value, isPreview]);

	return (
		<div className="mt-4 rounded-md border border-violet-300">
			<div className="flex border-b border-violet-300 p-2.5">
				{hierarchy.map((actions, i) => (
					<ActionsGroup key={i} separator={i !== 0}>
						{actions.map((action) => (
							<ActionItem
								key={action}
								onClick={handleActionClick(action)}
								icon={actionIcons[action]}
								label={actionLabels[action]}
								disabled={isPreview}
							/>
						))}
					</ActionsGroup>
				))}
				<ActionsGroup>
					<ActionItem
						icon={<EyeIcon />}
						label="zobacz podgląd"
						onClick={handlePreviewButtonClick}
					/>
				</ActionsGroup>
			</div>
			<div className="relative h-72">
				{isPreview ? (
					<Suspense
						fallback={
							<Loading
								label="Ładowanie podglądu…"
								className="absolute left-1/2 top-0 -translate-x-1/2"
							/>
						}
					>
						<ContentPreview content={value} />
					</Suspense>
				) : (
					<textarea
						aria-label="Wpisz treść pytania"
						className="prose prose-sm relative z-10 h-full w-full max-w-full resize-none bg-white px-4 py-2 dark:prose-invert md:prose-base focus:outline-0 dark:bg-white-dark"
						ref={textAreaRef}
						value={value}
						onChange={(event) => onChange(event.target.value)}
					/>
				)}
				<Loading label="Ładowanie podglądu…" className="absolute left-1/2 top-0 -translate-x-1/2" />
			</div>
		</div>
	);
});

WysiwygEditor.displayName = "QuestionEditor";
