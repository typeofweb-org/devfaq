"use client";

import { useEffect, useRef } from "react";
import EasyMDE from "easymde";

import "easymde/dist/easymde.min.css";

type EditorProps = Readonly<{
	value: string;
	label?: string;
	options?: EasyMDE.Options;
	onChange: (value: string) => void;
}>;

export const WysiwygEditor = ({ value, label, options, onChange }: EditorProps) => {
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
	const editorRef = useRef<EasyMDE | null>(null);

	useEffect(() => {
		if (textAreaRef.current && !editorRef.current) {
			const easyMDE = new EasyMDE({
				...options,
				element: textAreaRef.current,
				initialValue: value,
			});

			easyMDE.codemirror.on("change", () => {
				onChange(easyMDE.value());
			});

			editorRef.current = easyMDE;
		}

		return () => {
			editorRef.current?.cleanup();
		};
	}, [value, onChange, options]);

	return <textarea aria-label={label} ref={textAreaRef} />;
};
