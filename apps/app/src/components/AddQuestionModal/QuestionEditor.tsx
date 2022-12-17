"use client";

import dynamic from "next/dynamic";

const WysiwygEditor = dynamic(
	() =>
		import(/* webpackChunkName: "WysiwygEditor" */ "../WysiwygEditor").then(
			(mod) => mod.WysiwygEditor,
		),
	{
		ssr: false,
	},
);

type QuestionEditorProps = Readonly<{
	value: string;
	onChange: (value: string) => void;
}>;

export const QuestionEditor = ({ value, onChange }: QuestionEditorProps) => (
	<div className="mt-5 h-[371px] w-full">
		<WysiwygEditor label="Wpisz treść pytania" value={value} onChange={onChange} />
	</div>
);
