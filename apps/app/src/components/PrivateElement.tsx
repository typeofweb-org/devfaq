"use client";

import { ReactNode } from "react";
import { useUser } from "../hooks/useUser";

type PrivateElementProps = Readonly<{
	role?: string;
	children: ReactNode;
}>;

export const PrivateElement = ({ role, children }: PrivateElementProps) => {
	const { userData } = useUser();

	if (!userData || (role && userData._user._roleId !== role)) {
		return null;
	}

	return <>{children}</>;
};
