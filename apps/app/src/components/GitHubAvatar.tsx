import Image from "next/image";
import { ComponentProps } from "react";
import { User } from "../types";

type GitHubAvatarProps = Readonly<{
	user: Pick<User, "id" | "firstName" | "lastName" | "socialLogin">;
}> &
	Omit<ComponentProps<typeof Image>, "src" | "alt">;

export const GitHubAvatar = ({
	user: { id, firstName, lastName, socialLogin },
	...props
}: GitHubAvatarProps) => {
	if (!socialLogin.github) {
		return null;
	}

	const avatarUrl = `https://avatars.githubusercontent.com/u/${socialLogin.github}`;
	const alt = firstName
		? `Avatar of ${firstName} ${lastName || ""}`.trim()
		: `Avatar of user ${id}`;

	return <Image src={avatarUrl} alt={alt} {...props} />;
};
