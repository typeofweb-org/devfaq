const LOCALE = "pl-PL";

const longDateFormat = new Intl.DateTimeFormat(LOCALE, {
	day: "numeric",
	month: "long",
	year: "numeric",
});
const shortDateFormat = new Intl.DateTimeFormat(LOCALE, {
	day: "numeric",
	month: "numeric",
	year: "numeric",
});
const rules = new Intl.PluralRules(LOCALE);

export const pluralize = (one: string, few: string, many: string) => (count: number) => {
	return {
		zero: many,
		one,
		two: few,
		few,
		many,
		other: many,
	}[rules.select(count)];
};

export const formatDate = (date: Date, format: "long" | "short") => {
	if (format === "long") {
		return longDateFormat.format(date);
	}
	return shortDateFormat.format(date);
};
