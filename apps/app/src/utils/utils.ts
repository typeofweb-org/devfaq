export const range = (start: number, end: number) =>
	Array.from({ length: end - start }, (_, idx) => idx + start);

export const hellip = (text: string, maxLength: number) => {
	text = text.trim();

	if (text.length <= maxLength) {
		return text;
	}
	const partText = text.split(" ").reduce(
		(acc, word) => {
			if (acc.done) {
				return acc;
			}

			const newResult = acc.result + " " + word;
			if (newResult.length >= maxLength) {
				return { done: true, result: acc.result };
			}
			return { done: false, result: newResult };
		},
		{ done: false, result: "" },
	);

	return partText.result.trim() + "…";
};
