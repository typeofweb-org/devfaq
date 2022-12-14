import { usePathname, useSearchParams, useRouter } from "next/navigation";

export const useDevFAQRouter = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const queryParams = Object.fromEntries(searchParams.entries());

	const mergeQueryParams = (data: Record<string, string>) => {
		const params = { ...queryParams, ...data };
		const query = new URLSearchParams(params).toString();

		if (pathname) {
			router.push(`${pathname}?${query}`);
		}
	};

	return { queryParams, mergeQueryParams };
};
