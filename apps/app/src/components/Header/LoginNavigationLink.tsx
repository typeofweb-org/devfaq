"use client";

import { usePathname } from "next/navigation";
import { MouseEventHandler } from "react";
import { useUser } from "../../hooks/useUser";
import { UserAvatar } from "./UserAvatar";
import { ActiveNavigationLink } from "./ActiveNagivationLink";

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
		return (
			<button type="button" className="mx-auto flex">
				<UserAvatar userData={userData} />
				<span className="sr-only">wyloguj się</span>
			</button>
		);
	}

	return (
		<ActiveNavigationLink href={`/login?previousPath=${pathname || "/"}`} onClick={onClick}>
			Zaloguj
		</ActiveNavigationLink>
	);
};
