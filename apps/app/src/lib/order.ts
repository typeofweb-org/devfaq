import { QueryParam } from "../types";

export const ordersBy = ["acceptedAt", "level", "votesCount"] as const;
export const orders = ["asc", "desc"] as const;
export const DEFAULT_SORT_BY_QUERY = "acceptedAt*desc";

export const sortByLabels: Record<`${OrderBy}*${Order}`, string> = {
	"acceptedAt*asc": "od najstarszych",
	"acceptedAt*desc": "od najnowszych",
	"level*asc": "od najprostszych",
	"level*desc": "od najtrudniejszych",
	"votesCount*asc": "od najmniej popularnych",
	"votesCount*desc": "od najpopularniejszych",
};

type OrderBy = typeof ordersBy[number];
type Order = typeof orders[number];

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
