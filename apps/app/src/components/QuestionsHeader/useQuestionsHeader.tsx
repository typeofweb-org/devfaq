import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { DEFAULT_ORDER_QUERY } from "../../lib/order";

export const useQuestionsHeader = () => {
	const [value, setValue] = useState(DEFAULT_ORDER_QUERY);
	const pathname = usePathname();
	const router = useRouter();

	const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const { value } = event.target;

		event.preventDefault();
		setValue(value);

		if (pathname) {
			router.push(`${pathname}?sortBy=${value}`);
		}
	};

	return { value, handleSelectChange };
};
