import { useCallback } from "react";
import { useUser } from "./useUser";

export const useLogin = () => {
	const { updateLoggedInUser } = useUser();

	const loginWithGitHub = useCallback(() => {
		const width = 925;
		const height = 680;

		const top = window.outerHeight / 2 + window.screenY - height / 2;
		const left = window.outerWidth / 2 + window.screenX - width / 2;

		return new Promise<void>((resolve, reject) => {
			if (!process.env.NEXT_PUBLIC_API_URL) {
				return reject(new Error("'NEXT_PUBLIC_API_URL' env not found!"));
			}

			const popup = window.open(
				`${process.env.NEXT_PUBLIC_API_URL}/oauth/github/login`,
				"GitHub Login",
				`width=${width},height=${height},top=${top},left=${left}`,
			);

			if (!popup) {
				return reject(new Error("Window not created!"));
			}

			const intervalId = setInterval(() => {
				if (popup.closed) {
					clearInterval(intervalId);

					updateLoggedInUser.mutate(
						{},
						{
							onSuccess: () => {
								resolve();
							},
							onError: reject,
						},
					);
				}
			}, 100);
		});
	}, [updateLoggedInUser]);

	return { loginWithGitHub };
};
