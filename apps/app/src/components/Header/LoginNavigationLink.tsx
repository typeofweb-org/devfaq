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
			<button
				type="button"
				className="relative mx-auto flex flex min-h-[48px] flex-row items-center rounded-full bg-violet-800 px-6 uppercase transition-opacity hover:opacity-80 dark:bg-violet-700 sm:min-h-[24px] sm:px-4"
			>
				Zaloguj
			</button>
		</ActiveNavigationLink>
	);
};
