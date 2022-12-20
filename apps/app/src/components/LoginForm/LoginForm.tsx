import { AppLogo } from "../AppLogo";
import { BackLink } from "./BackLink";
import { GitHubLoginButton } from "./GitHubLoginButton";

export const LoginForm = () => (
	<div className="mx-auto flex max-w-[520px] flex-col items-center gap-10 p-8 pt-0 sm:pt-8">
		<AppLogo />
		<p className="text-center text-xl text-white">
			Stwórz konto już dzisiaj i korzystaj z dodatkowych funkcji serwisu DevFAQ!
		</p>
		<GitHubLoginButton />
		<BackLink />
	</div>
);
