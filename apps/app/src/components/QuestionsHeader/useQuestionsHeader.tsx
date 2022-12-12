import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { useDevFAQRouter } from "../../hooks/useDevFAQRouter";

export const useQuestionsHeader = () => {
	const pathname = usePathname();
	const router = useRouter();
	const { mergeQueryParams } = useDevFAQRouter();

	const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const { value } = event.target;

		event.preventDefault();

		if (pathname) {
			router.push(`${pathname}?${mergeQueryParams({ sortBy: value })}`);
		}
	};

	return { handleSelectChange };
};
