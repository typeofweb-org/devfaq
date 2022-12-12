"use client";

import { useRouter, useSearchParams } from "next/navigation";
import GitHubLogo from "../../../public/icons/github-logo.svg";
import { useLogin } from "../../hooks/useLogin";

export const GitHubLoginButton = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { loginWithGitHub } = useLogin();

	const previousPath = searchParams.get("previousPath") || "/";

	const handleClick = async () => {
		try {
			await loginWithGitHub();

			router.push(previousPath);
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
