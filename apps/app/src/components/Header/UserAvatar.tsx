"use client";

import { useIsAboveBreakpoint } from "../../hooks/useIsAboveBreakpoint";
import { UserData } from "../../types";
import { GitHubAvatar } from "../GitHubAvatar";

type UserAvatarProps = Readonly<{
	userData: UserData;
}>;

export const UserAvatar = ({ userData }: UserAvatarProps) => {
	const { _user } = userData;
	const isAboveBreakpoint = useIsAboveBreakpoint({ breakpoint: 640 });

	return <GitHubAvatar user={_user} className="mx-auto rounded-full" />;
};
