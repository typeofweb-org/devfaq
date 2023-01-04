"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useDevFAQRouter } from "../hooks/useDevFAQRouter";
import { useUser } from "../hooks/useUser";

type PrivateRouteProps = Readonly<{
	children: ReactNode;
	loginPreviousPath?: string;
}>;

export const PrivateRoute = ({ children, loginPreviousPath }: PrivateRouteProps) => {
	const { isLoading, userData } = useUser();
	const router = useRouter();
	const { getLoginPageHref } = useDevFAQRouter();

	useEffect(() => {
		if (isLoading) return;

		if (!userData) {
			router.replace(
				loginPreviousPath ? `/login?previousPath=${loginPreviousPath}` : getLoginPageHref(),
			);
			return;
		}

		if (userData._user._roleId !== "admin") {
			router.replace("/");
		}
	}, [getLoginPageHref, isLoading, loginPreviousPath, router, userData]);

	if (isLoading || !userData || userData._user._roleId !== "admin") {
		return null;
	}

	return <>{children}</>;
};
