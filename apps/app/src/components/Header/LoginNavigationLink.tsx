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
				className="relative mx-auto flex flex min-h-[30px] flex-row items-center rounded-full bg-violet-800 px-4 text-sm uppercase transition-opacity hover:opacity-80 dark:bg-violet-700"
			>
				<span className="">Zaloguj</span>
			</button>
		</ActiveNavigationLink>
	);
};
