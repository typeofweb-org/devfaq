import { getConfig } from "../config/config.js";

export const revalidate = (path: string) =>
	fetch(
		`${getConfig("APP_URL")}/api/revalidation?token=${getConfig(
			"REVALIDATION_TOKEN",
		)}&path=${path}`,
		{ method: "POST" },
	);
