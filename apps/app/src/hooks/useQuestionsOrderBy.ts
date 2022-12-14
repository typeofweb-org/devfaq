import { useSearchParams } from "next/navigation";
import { parseQuerySortBy, DEFAULT_SORT_BY_QUERY } from "../lib/order";
import { useDevFAQRouter } from "./useDevFAQRouter";

export const useQuestionsOrderBy = () => {
	const searchParams = useSearchParams();
	const { mergeQueryParams } = useDevFAQRouter();

	const sortBy = searchParams.get("sortBy") || DEFAULT_SORT_BY_QUERY;

	const setSortByFromString = (sortBy: string) => {
		if (parseQuerySortBy(sortBy)) {
			mergeQueryParams({ sortBy });
		}
	};

	return { sortBy, setSortByFromString };
};
