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
	selection: { start, end },
	value,
	action,
}: {
	selection: {
		start: number;
		end: number;
	};
	value: string;
	action: Action;
}) => {
	const { open, close, newLine } = actions[action];

	const prevChar = value.substring(start - 1, start);
	const insertNewLine = newLine && prevChar !== "" && prevChar !== "\n";
	const newValue =
		value.substring(0, start) +
		`${insertNewLine ? "\n" : ""}${open}` +
		value.substring(start, end) +
		close +
		value.substring(end);
	const selection = open.length + (insertNewLine ? 1 : 0);

	return {
		start: selection + start,
		end: selection + end,
		newValue,
	};
};
