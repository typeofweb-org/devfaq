import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDevFAQRouter } from "./useDevFAQRouter";

export const useQuestionsOrderBy = () => {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { mergeQueryParams } = useDevFAQRouter();

	const orderBy = searchParams.get("sortBy") || undefined;

	const setOrderBy = (order: string) => {
		if (pathname) {
			router.push(`${pathname}?${mergeQueryParams({ sortBy: order })}`);
		}
	};

	return { orderBy, setOrderBy };
};
