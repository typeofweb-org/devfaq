export const actions = {
	BOLD: { open: "**", close: "**", newLine: false },
	ITALIC: { open: "_", close: "_", newLine: false },
	HEADING: { open: "# ", close: "", newLine: true },
	CODEBLOCK: {
		open: "```javascript\n",
		close: "\n```",
		newLine: true,
	},
	UL: { open: "* ", close: "", newLine: true },
	OL: { open: "1. ", close: "", newLine: true },
};

export type Action = keyof typeof actions;

export const handleAction = ({
	selectionStart,
	selectionEnd,
	value,
	action,
}: {
	selectionStart: number;
	selectionEnd: number;
	value: string;
	action: Action;
}) => {
	const { open, close, newLine } = actions[action];

	const prevChar = value.substring(selectionStart - 1, selectionStart);
	const insertNewLine = newLine && prevChar !== "" && prevChar !== "\n";
	const newValue =
		value.substring(0, selectionStart) +
		`${insertNewLine ? "\n" : ""}${open}` +
		value.substring(selectionStart, selectionEnd) +
		close +
		value.substring(selectionEnd);
	const selection = open.length + (insertNewLine ? 1 : 0);

	return {
		start: selection + selectionStart,
		end: selection + selectionEnd,
		newValue,
	};
};
