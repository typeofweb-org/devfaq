export const technologies = ["html", "css", "js", "angular", "react", "git", "other"] as const;
export type Technology = typeof technologies[number];
