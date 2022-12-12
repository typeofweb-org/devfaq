import { usePathname, useRouter } from "next/navigation";
import { useDevFAQRouter } from "./useDevFAQRouter";

export const useQuestionsOrderBy = () => {
	const pathname = usePathname();
	const router = useRouter();
	const { mergeQueryParams } = useDevFAQRouter();

	const setOrderBy = (order: string) => {
		if (pathname) {
			router.push(`${pathname}?${mergeQueryParams({ sortBy: order })}`);
		}
	};

	return { setOrderBy };
};
