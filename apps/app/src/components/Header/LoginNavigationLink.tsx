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
	const { userData, isLoading, logout } = useUser();

	if (isLoading) {
		return null;
	}

	if (userData) {
		return (
			<button
				type="button"
				className="mx-auto flex transition-opacity hover:opacity-80"
				onClick={() => logout.mutate({})}
			>
				<UserAvatar userData={userData} />
				<span className="sr-onlu">wyloguj się</span>
			</button>
		);
	}

	return (
		<ActiveNavigationLink href={`/login?previousPath=${pathname || "/"}`} onClick={onClick}>
			Zaloguj
		</ActiveNavigationLink>
	);
};
