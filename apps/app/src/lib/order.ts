const orderBy = ["acceptedAt", "level", "votesCount"] as const;
const order = ["asc", "desc"] as const;
export const levels = ["junior", "mid", "senior"] as const;

type OrderBy = typeof orderBy[number];
type Order = typeof order[number];
export type Level = typeof levels[number];

export const DEFAULT_SORT_BY_QUERY = "acceptedAt*desc";

export const validateOrderBy = (data: string): data is OrderBy => {
	return orderBy.includes(data);
};

export const validateOrder = (data: string): data is Order => {
	return order.includes(data);
};

export const validateSortByQuery = (query?: string | string[]): query is `${OrderBy}*${Order}` => {
	if (typeof query !== "string") {
		return false;
	}

	const [orderBy, order] = query.split("*");

	return Boolean(orderBy && order && validateOrderBy(orderBy) && validateOrder(order));
};

export const getQuerySortBy = (query?: string | string[]) => {
	if (!validateSortByQuery(query)) {
		return null;
	}

	const [orderBy, order] = query.split("*") as [OrderBy, Order];

	return { orderBy, order };
};

export const validateLevelQuery = (query?: string | string[] | null): query is string => {
	if (typeof query !== "string") {
		return false;
	}

	const splittedLevels = query.split(",");

	return splittedLevels.every((level) => levels.includes(level));
};

export const getQueryLevels = (query?: string | string[] | null) => {
	if (!validateLevelQuery(query)) {
		return null;
	}

	return query.split(",") as Level[];
};
