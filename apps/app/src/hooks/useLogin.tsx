import { useCallback } from "react";
import { getLoggedInUser } from "../services/users.service";
import { UserData } from "../types";

export const useLogin = () => {
	const loginWithGitHub = useCallback(() => {
		const width = 925;
		const height = 680;

		const top = window.outerHeight / 2 + window.screenY - height / 2;
		const left = window.outerWidth / 2 + window.screenX - width / 2;

		const popup = window.open(
			`${process.env.NEXT_PUBLIC_API_URL || ""}/oauth/github/login`,
			"GitHub Login",
			`width=${width},height=${height},top=${top},left=${left}`,
		);

		return new Promise<UserData>((resolve, reject) => {
			if (!popup) {
				return reject(new Error("Window not created!"));
			}

			const intervalId = setInterval(() => {
				if (popup.closed) {
					clearInterval(intervalId);
					getLoggedInUser({})
						.then(({ data: { data } }) => resolve(data["_user"]))
						.catch(reject);
				}
			}, 100);
		});
	}, []);

	return { loginWithGitHub };
};
