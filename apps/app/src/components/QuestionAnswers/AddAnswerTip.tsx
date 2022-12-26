"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useUser } from "../../hooks/useUser";
import { Button } from "../Button/Button";
import { Tip } from "../Tip";

type AddAnswerTipProps = Readonly<{
	children: ReactNode;
}>;

export const AddAnswerTip = ({ children }: AddAnswerTipProps) => {
	const pathname = usePathname();
	const { userData, isLoading } = useUser();

	if (isLoading) {
		return null;
	}

	if (!userData) {
		return (
			<Tip className="mt-6 flex items-center justify-between gap-x-2">
				<p>
					<b>Chcesz dodać odpowiedź?</b> Najpierw musisz się zalogować!
				</p>
				<Link href={`/login?previousPath=${pathname || ""}`}>
					<Button variant="branding">Zaloguj się</Button>
				</Link>
			</Tip>
		);
	}

	return <>{children}</>;
};
