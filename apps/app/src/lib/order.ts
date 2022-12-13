const orderBy = ["acceptedAt", "level", "votesCount"] as const;
const order = ["asc", "desc"] as const;

type OrderBy = typeof orderBy[number];
type Order = typeof order[number];

export const DEFAULT_SORT_BY_QUERY = "acceptedAt*desc";

export const validateOrderBy = (data: string): data is OrderBy => {
	return orderBy.includes(data);
};

export const validateOrder = (data: string): data is Order => {
	return order.includes(data);
};

export const validateSortByQuery = (query?: string): query is `${OrderBy}*${Order}` => {
	const [orderBy, order] = query?.split("*") || [];

	return Boolean(orderBy && order && validateOrderBy(orderBy) && validateOrder(order));
};

export const getQuerySortBy = (query?: string) => {
	if (!validateSortByQuery(query)) {
		return null;
	}

	const [orderBy, order] = query.split("*") as [OrderBy, Order];

	return { orderBy, order };
};
