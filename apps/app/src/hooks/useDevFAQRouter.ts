import { usePathname, useSearchParams, useRouter } from "next/navigation";

export const useDevFAQRouter = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const mergeQueryParams = (data: Record<string, string>) => {
		const params = { ...Object.fromEntries(searchParams.entries()), ...data };
		const query = new URLSearchParams(params).toString();

		if (pathname) {
			router.push(`${pathname}?${query}`);
		}
	};

	const redirectToLoginPage = () => {
		router.push(`/login?previousPath=${pathname || "/"}`);
	};

	return { mergeQueryParams, redirectToLoginPage };
};
