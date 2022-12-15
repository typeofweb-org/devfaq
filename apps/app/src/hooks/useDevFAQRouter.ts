import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useUser } from "./useUser";

export const useDevFAQRouter = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { userData } = useUser();

	const mergeQueryParams = (data: Record<string, string>) => {
		const params = { ...Object.fromEntries(searchParams.entries()), ...data };
		const query = new URLSearchParams(params).toString();

		if (pathname) {
			router.push(`${pathname}?${query}`);
		}
	};

	const requireLoggedIn = <T>(callback: (...args: T[]) => unknown) => {
		if (!userData) {
			return () => router.push(`/login?previousPath=${pathname || "/"}`);
		}

		return callback;
	};

	return { mergeQueryParams, requireLoggedIn };
};
