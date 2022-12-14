import { QueryParam } from "../types";

export const levels = ["junior", "mid", "senior"] as const;

export type Level = typeof levels[number];

export const parseQueryLevels = (query?: QueryParam | null) => {
	if (typeof query !== "string") {
		return null;
	}

	const splittedQuery = query.split(",");

	if (!splittedQuery.every((level) => levels.includes(level))) {
		return null;
	}

	return splittedQuery as Level[];
};
