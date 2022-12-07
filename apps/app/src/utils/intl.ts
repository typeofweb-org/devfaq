const rules = new Intl.PluralRules("pl-PL");

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
