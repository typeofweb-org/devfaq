"use client";

import dynamic from "next/dynamic";

const WysiwygEditor = dynamic(() => import("../WysiwygEditor").then((mod) => mod.WysiwygEditor), {
	ssr: false,
});

const options = {
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
	status: false,
} as const;

type QuestionEditorProps = Readonly<{
	value: string;
	onChange: (value: string) => void;
}>;

export const QuestionEditor = ({ value, onChange }: QuestionEditorProps) => (
	<div className="mt-5">
		<WysiwygEditor
			label="Wpisz treść pytania"
			value={value}
			onChange={onChange}
			options={options}
		/>
	</div>
);
