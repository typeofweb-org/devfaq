"use client";

import { usePathname } from "next/navigation";
import { MouseEventHandler } from "react";
import { useUser } from "../../hooks/useUser";
import { ActiveNavigationLink } from "./ActiveNagivationLink";
import { UserMenu } from "./UserMenu";

export const LoginNavigationLink = ({
	onClick,
}: {
	onClick?: MouseEventHandler<HTMLAnchorElement>;
}) => {
	const pathname = usePathname();
	const { userData, isLoading } = useUser();

	if (isLoading) {
		return null;
	}

	if (userData) {
		return <UserMenu userData={userData} />;
	}

	return (
		<ActiveNavigationLink href={`/login?previousPath=${pathname || "/"}`} onClick={onClick}>
			Zaloguj
		</ActiveNavigationLink>
	);
};
