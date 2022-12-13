const orderBy = ["acceptedAt", "level", "votesCount"] as const;
const order = ["asc", "desc"] as const;

export const DEFAULT_ORDER_QUERY = "acceptedAt*desc";

export const validateOrderBy = (data: string): data is typeof orderBy[number] => {
	return orderBy.includes(data);
};

export const validateOrder = (data: string): data is typeof order[number] => {
	return order.includes(data);
};