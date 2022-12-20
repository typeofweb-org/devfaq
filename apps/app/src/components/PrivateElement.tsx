"use client";

import { ReactNode } from "react";
import { useUser } from "../hooks/useUser";

type PrivateElementProps = Readonly<{
	children: ReactNode;
}>;

export const PrivateElement = ({ children }: PrivateElementProps) => {
	const { userData } = useUser();

	if (!userData || userData._user._roleId !== "admin") {
		return null;
	}

	return <>{children}</>;
};
