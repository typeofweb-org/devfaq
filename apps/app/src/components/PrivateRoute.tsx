"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useDevFAQRouter } from "../hooks/useDevFAQRouter";
import { useUser } from "../hooks/useUser";

type PrivateRouteProps = Readonly<{
	role?: string;
	loginPreviousPath?: string;
	children: ReactNode;
}>;

export const PrivateRoute = ({ role, loginPreviousPath, children }: PrivateRouteProps) => {
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

		if (role && userData._user._roleId !== role) {
			router.replace("/");
		}
	}, [getLoginPageHref, isLoading, loginPreviousPath, role, router, userData]);

	if (isLoading || !userData || (role && userData._user._roleId !== role)) {
		return null;
	}

	return <>{children}</>;
};
