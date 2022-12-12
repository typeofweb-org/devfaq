import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent } from "react";

export const useQuestionsHeader = () => {
	const pathname = usePathname();
	const router = useRouter();

	const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const { value } = event.target;

		event.preventDefault();

		if (pathname) {
			router.push(`${pathname}?sortBy=${value}`);
		}
	};

	return { handleSelectChange };
};
