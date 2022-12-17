"use client";

import { useEffect, useRef } from "react";
import EasyMDE from "easymde";

import "easymde/dist/easymde.min.css";
import { useEvent } from "../hooks/useEvent";

type EditorProps = Readonly<{
	value: string;
	label?: string;
	onChange: (value: string) => void;
}>;

export const WysiwygEditor = ({ value, label, onChange }: EditorProps) => {
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
	const editorRef = useRef<EasyMDE | null>(null);
	const onChangeEvent = useEvent(onChange);

	useEffect(() => {
		if (textAreaRef.current && !editorRef.current) {
			const easyMDE = new EasyMDE({
				element: textAreaRef.current,
				spellChecker: false,
				nativeSpellcheck: false,
				unorderedListStyle: "-",
				status: false,
				maxHeight: "300px",
				toolbar: [
					"bold",
					"italic",
					"heading",
					"|",
					"code",
					"unordered-list",
					"ordered-list",
					"|",
					"preview",
				],
				shortcuts: {
					toggleBlockquote: null,
					toggleBold: null,
					cleanBlock: null,
					toggleHeadingSmaller: null,
					toggleItalic: null,
					drawLink: null,
					toggleUnorderedList: null,
					togglePreview: null,
					toggleCodeBlock: null,
					drawImage: null,
					toggleOrderedList: null,
					toggleHeadingBigger: null,
					toggleSideBySide: null,
					toggleFullScreen: null,
					toggleHeading1: null,
					toggleHeading2: null,
					toggleHeading3: null,
					toggleHeading4: null,
					toggleHeading5: null,
					toggleHeading6: null,
				},
			});

			easyMDE.codemirror.on("change", () => {
				onChangeEvent(easyMDE.value());
			});

			editorRef.current = easyMDE;
		}

		return () => {
			editorRef.current?.toTextArea();
			editorRef.current?.cleanup();
			editorRef.current = null;
		};
	}, [onChangeEvent]);

	// useEffect(() => {
	// 	if (value !== editorRef.current?.codemirror.getValue()) {
	// 		editorRef.current?.codemirror.setValue(value);
	// 	}
	// }, [value]);

	return <textarea aria-label={label} ref={textAreaRef} />;
};
