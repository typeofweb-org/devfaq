"use client";

import { UserData } from "../../types";
import { GitHubAvatar } from "../GitHubAvatar";

type UserAvatarProps = Readonly<{
	userData: UserData;
}>;

export const UserAvatar = ({ userData }: UserAvatarProps) => {
	const { _user } = userData;

	return <GitHubAvatar user={_user} width={38} height={38} className="mx-auto rounded-full" />;
};
