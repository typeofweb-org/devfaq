import { useSearchParams } from "next/navigation";
import { useDevFAQRouter } from "./useDevFAQRouter";

export const useQuestionsOrderBy = () => {
	const searchParams = useSearchParams();
	const { mergeQueryParams } = useDevFAQRouter();

	const orderBy = searchParams.get("sortBy") || undefined;

	const setOrderBy = (order: string) => {
		mergeQueryParams({ sortBy: order });
	};

	return { orderBy, setOrderBy };
};
