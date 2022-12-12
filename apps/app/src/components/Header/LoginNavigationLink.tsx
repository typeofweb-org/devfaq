"use client";

import { usePathname } from "next/navigation";
import { ActiveNavigationLink } from "./ActiveNagivationLink";

export const LoginNavigationLink = () => {
	const pathname = usePathname();

	return (
		<ActiveNavigationLink href={`/login?previousPath=${pathname || "/"}`}>
			Zaloguj
		</ActiveNavigationLink>
	);
};
