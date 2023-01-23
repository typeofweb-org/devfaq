import { QueryParam } from "../types";

const ordersBy = ["acceptedAt", "level", "votesCount", "updatedAt"] as const;
const orders = ["asc", "desc"] as const;

export const DEFAULT_SORT_BY_QUERY = "acceptedAt*desc";
export const sortByLabels: Record<`${OrderBy}*${Order}`, string> = {
	"acceptedAt*asc": "data dodania: najstarsze",
	"acceptedAt*desc": "data dodania: najnowsze",
	"level*asc": "trudność: od najtrudniejszych",
	"level*desc": "trudność: od najprostszych",
	"votesCount*asc": "popularność: najmniejsza",
	"votesCount*desc": "popularność: największa",
	"updatedAt*asc": "data edycji: najstarsze",
	"updatedAt*desc": "data edycji: najnowsze",
};

export type OrderBy = typeof ordersBy[number];
export type Order = typeof orders[number];

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
