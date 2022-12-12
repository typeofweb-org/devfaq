import { useSearchParams } from "next/navigation";

export const useDevFAQRouter = () => {
	const searchParams = useSearchParams();

	const mergeQueryParams = (params: Record<string, string>) => {
		const query = { ...Object.fromEntries(searchParams.entries()), ...params };

		return new URLSearchParams(query).toString();
	};

	return { mergeQueryParams };
};
