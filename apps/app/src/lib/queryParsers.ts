import { QueryParam } from "../types";

export const parsePageQuery = (query: QueryParam | null) => {
	if (!query) {
		return 1;
	}

	return Number(query);
};
