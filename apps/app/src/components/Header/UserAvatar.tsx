"use client";

import Image from "next/image";
import { useUser } from "../../hooks/useUser";
import { UserData } from "../../types";

type UserAvatarProps = Readonly<{
	user: UserData;
}>;

export const UserAvatar = ({ user }: UserAvatarProps) => {
	const { logout } = useUser();

	if (!user.socialLogin.github) {
		return null;
	}

	const gitHubAvatarUrl = `https://avatars0.githubusercontent.com/u/${user.socialLogin.github}`;
	const alt = user.firstName
		? `Avatar of ${user.firstName} ${user.lastName || ""}`.trim()
		: `Avatar of user ${user.id}`;

	return (
		<Image
			src={gitHubAvatarUrl}
			alt={alt}
			width={38}
			height={38}
			title="Kliknij, aby się wylogować"
			onClick={() => logout.mutate({})}
			className="cursor-pointer rounded-full"
		/>
	);
};
