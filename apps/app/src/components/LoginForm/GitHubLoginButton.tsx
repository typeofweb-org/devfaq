"use client";

import { useSearchParams } from "next/navigation";
import GitHubLogo from "../../../public/icons/github-logo.svg";
import { useLogin } from "../../hooks/useLogin";
import { getLoggedInUser } from "../../services/users.service";

export const GitHubLoginButton = () => {
	const searchParams = useSearchParams();
	const previousPath = searchParams.get("previousPath") || "/";
	const { loginWithGitHub } = useLogin();

	const handleClick = async () => {
		try {
			await loginWithGitHub();
			await getLoggedInUser({});
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<button
			onClick={() => {
				void handleClick();
			}}
			className="flex w-fit items-center rounded-lg border-2 border-neutral-300 bg-white p-2 text-zinc-800"
		>
			<GitHubLogo className="mr-3" />
			Zaloguj się przez GitHuba
		</button>
	);
};
