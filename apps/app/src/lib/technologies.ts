import { QueryParam } from "../types";

export const technologies = ["html", "css", "js", "angular", "react", "git", "other"] as const;
export type Technology = typeof technologies[number];

export const technologiesLabels: Record<Technology, string> = {
	html: "HTML",
	css: "CSS",
	js: "JS",
	angular: "Angular",
	react: "React",
	git: "Git",
	other: "Inne",
};

export const technologiesLongLabels: Partial<Record<Technology, string>> = {
	js: "JavaScript",
	react: "React.js",
};

export const validateTechnology = (technology: string): technology is Technology => {
	return technologies.includes(technology);
};

export const parseTechnologyQuery = (query: QueryParam | null) => {
	if (typeof query !== "string" || !validateTechnology(query)) {
		return null;
	}

	return query;
};
