import { AppLogo } from "../AppLogo";
import { BackLink } from "./BackLink";
import { GitHubLoginButton } from "./GitHubLoginButton";

export const LoginForm = () => (
	<div className="mx-auto flex max-w-[520px] flex-col items-center p-8 pt-[20vmin]">
		<AppLogo />
		<span className="mt-8 mb-10 text-center text-xl text-white">
			Stwórz konto już dzisiaj i korzystaj z dodatkowych funkcji serwisu DevFAQ!
		</span>
		<GitHubLoginButton />
		<BackLink />
	</div>
);
