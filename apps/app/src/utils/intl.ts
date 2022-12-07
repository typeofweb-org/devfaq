const LOCALE = "pl-PL";

const dateFormat = new Intl.DateTimeFormat(LOCALE, {
	day: "numeric",
	month: "long",
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

export const format = (date: Date) => {
	return dateFormat.format(date);
};
