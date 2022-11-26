export function getConfig(name: "PORT"): number;
export function getConfig(name: "NODE_ENV"): "production" | "development";
export function getConfig(name: "ENV"): "production" | "staging" | "development" | "test";
export function getConfig(name: "GITHUB_CLIENT_ID"): string;
export function getConfig(name: "GITHUB_CLIENT_SECRET"): string;
export function getConfig(name: "GIT_BRANCH"): string;
export function getConfig(name: "GIT_COMMIT_HASH"): string;
export function getConfig(name: "VERSION"): string;
export function getConfig(name: "SENTRY_VERSION"): string;
export function getConfig(name: string): string;
export function getConfig(name: string): string | number {
	const val = process.env[name];

	switch (name) {
		case "PORT":
			return val ? Number(val) : "3002";
		case "NODE_ENV":
			return val || "development";
		case "ENV":
			return val || "development";
		case "GITHUB_CLIENT_ID":
		case "GITHUB_CLIENT_SECRET":
			return val || "";
		case "GIT_BRANCH":
			return val || "(unknown_branch)";
		case "GIT_COMMIT_HASH":
			return val || "(unknown_commit_hash)";
		case "VERSION":
			return getConfig("ENV") + ":" + getConfig("GIT_BRANCH") + ":" + getConfig("GIT_COMMIT_HASH");
		case "SENTRY_VERSION":
			return getConfig("GIT_COMMIT_HASH") || "";
	}

	if (!val) {
		throw new Error(`Cannot find environmental variable: ${name}`);
	}

	return val;
}

export const isProd = () => getConfig("ENV") === "production";
export const isStaging = () => getConfig("ENV") === "staging";
