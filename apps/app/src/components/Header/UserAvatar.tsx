"use client";

import { useUser } from "../../hooks/useUser";
import { UserData } from "../../types";
import { GitHubAvatar } from "../GitHubAvatar";

type UserAvatarProps = Readonly<{
	userData: UserData;
}>;

export const UserAvatar = ({ userData }: UserAvatarProps) => {
	const { logout } = useUser();
	const { _user } = userData;

	return (
		<GitHubAvatar
			user={_user}
			width={38}
			height={38}
			title="Kliknij, aby się wylogować"
			onClick={() => logout.mutate({})}
			className="mx-auto cursor-pointer rounded-full transition-opacity hover:opacity-80"
		/>
	);
};
