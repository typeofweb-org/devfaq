import { useSearchParams } from "next/navigation";

export const useDevFAQRouter = () => {
	const searchParams = useSearchParams();

	const mergeQueryParams = (data: Record<string, string>) => {
		const params = { ...Object.fromEntries(searchParams.entries()), ...data };

		return new URLSearchParams(params).toString();
	};

	return { mergeQueryParams };
};
