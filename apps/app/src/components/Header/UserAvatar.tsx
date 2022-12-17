"use client";

import Image from "next/image";
import { useUser } from "../../hooks/useUser";
import { UserData } from "../../types";

type UserAvatarProps = Readonly<{
	userData: UserData;
}>;

export const UserAvatar = ({ userData }: UserAvatarProps) => {
	const { logout } = useUser();
	const { _user } = userData;

	if (!_user.socialLogin.github) {
		return null;
	}

	const avatarUrl = `https://avatars.githubusercontent.com/u/${_user.socialLogin.github}`;
	const alt = _user.firstName
		? `Avatar of ${_user.firstName} ${_user.lastName || ""}`.trim()
		: `Avatar of user ${_user.id}`;

	return (
		<Image
			src={avatarUrl}
			alt={alt}
			width={38}
			height={38}
			title="Kliknij, aby się wylogować"
			onClick={() => logout.mutate({})}
			className="mx-auto cursor-pointer rounded-full"
		/>
	);
};
