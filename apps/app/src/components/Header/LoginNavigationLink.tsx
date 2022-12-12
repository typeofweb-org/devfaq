"use client";

import { usePathname } from "next/navigation";
import { useUser } from "../../hooks/useUser";
import { UserAvatar } from "./UserAvatar";
import { ActiveNavigationLink } from "./ActiveNagivationLink";

export const LoginNavigationLink = () => {
	const pathname = usePathname();
	const { user } = useUser();

	if (user) {
		return <UserAvatar user={user} />;
	}

	return (
		<ActiveNavigationLink href={`/login?previousPath=${pathname || "/"}`}>
			Zaloguj
		</ActiveNavigationLink>
	);
};
