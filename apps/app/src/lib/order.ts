import { QueryParam } from "../types";

const ordersBy = ["acceptedAt", "level", "votesCount"] as const;
const orders = ["asc", "desc"] as const;
export const levels = ["junior", "mid", "senior"] as const;

export type Level = typeof levels[number];

export const DEFAULT_SORT_BY_QUERY = "acceptedAt*desc";

export const parseQuerySortBy = (query: QueryParam) => {
	if (typeof query !== "string") {
		return null;
	}

	const [orderBy, order] = query.split("*");

	if (!orderBy || !order || !ordersBy.includes(orderBy) || !orders.includes(order)) {
		return null;
	}

	return { orderBy, order };
};

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
