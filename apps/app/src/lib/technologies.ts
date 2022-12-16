export const technologies = ["html", "css", "js", "angular", "react", "git", "other"] as const;
export type Technology = typeof technologies[number];

export const technologiesLabel: Record<Technology, string> = {
	html: "HTML5",
	css: "CSS3",
	js: "JS",
	angular: "Angular",
	react: "React",
	git: "Git",
	other: "Inne",
};

export const validateTechnology = (technology: string): technology is Technology => {
	return technologies.includes(technology);
};
