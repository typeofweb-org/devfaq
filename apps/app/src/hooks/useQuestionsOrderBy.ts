import { useSearchParams } from "next/navigation";
import { validateOrderByQuery, DEFAULT_ORDER_QUERY } from "../lib/order";
import { useDevFAQRouter } from "./useDevFAQRouter";

export const useQuestionsOrderBy = () => {
	const searchParams = useSearchParams();
	const { mergeQueryParams } = useDevFAQRouter();

	const orderBy = searchParams.get("orderBy") || DEFAULT_ORDER_QUERY;

	const setOrderBy = (order: string) => {
		if (validateOrderByQuery(order)) {
			mergeQueryParams({ orderBy: order });
		}
	};

	return { orderBy, setOrderBy };
};
