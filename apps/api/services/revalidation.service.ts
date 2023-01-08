import { getConfig } from "../config/config.js";

export const revalidate = (path: string) => {
	console.log(getConfig("APP_URL"));

	return fetch(
		`${getConfig("APP_URL")}/api/revalidation?token=${getConfig(
			"REVALIDATION_TOKEN",
		)}&path=${path}`,
		{ method: "POST" },
	);
};
