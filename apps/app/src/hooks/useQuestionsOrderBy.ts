import { useSearchParams } from "next/navigation";
import { validateSortByQuery, DEFAULT_SORT_BY_QUERY, getQueryLevels, Level } from "../lib/order";
import { useDevFAQRouter } from "./useDevFAQRouter";

export const useQuestionsOrderBy = () => {
	const searchParams = useSearchParams();
	const { mergeQueryParams } = useDevFAQRouter();

	const sortBy = searchParams.get("sortBy") || DEFAULT_SORT_BY_QUERY;
	const queryLevel = searchParams.get("level");
	const queryLevels = getQueryLevels(queryLevel) || "";

	const setSortByFromString = (sortBy: string) => {
		if (validateSortByQuery(sortBy)) {
			mergeQueryParams({ sortBy });
		}
	};

	const addLevel = (level: Level) => {
		if (!queryLevel || queryLevels) {
			mergeQueryParams({ level: [...queryLevels, level].join(",") });
		}
	};

	const removeLevel = (level: Level) => {
		if (queryLevels) {
			const index = queryLevels.indexOf(level);

			queryLevels.splice(index, 1);
			mergeQueryParams({ level: queryLevels.join(",") });
		}
	};

	return { sortBy, setSortByFromString, queryLevels, addLevel, removeLevel };
};
