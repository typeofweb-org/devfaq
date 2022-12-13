"use client";

import { usePathname } from "next/navigation";
import { useUser } from "../../hooks/useUser";
import { UserAvatar } from "./UserAvatar";
import { ActiveNavigationLink } from "./ActiveNagivationLink";

export const LoginNavigationLink = () => {
	const pathname = usePathname();
	const { userData, isLoading } = useUser();

	if (isLoading) {
		return null;
	}

	if (userData) {
		return <UserAvatar userData={userData} />;
	}

	return (
		<ActiveNavigationLink href={`/login?previousPath=${pathname || "/"}`}>
			Zaloguj
		</ActiveNavigationLink>
	);
};
