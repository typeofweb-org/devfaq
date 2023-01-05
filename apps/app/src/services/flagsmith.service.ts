import "server-only";

import Flagsmith from "flagsmith-nodejs";
import { BaseFlag } from "flagsmith-nodejs/build/sdk/models";

type Flag = "question_answers";
const defaultFlags: Record<Flag, BaseFlag> = {
	question_answers: { enabled: true, value: undefined, isDefault: true },
};

const getFlagsmith = async () => {
	if (!process.env.FLAGSMITH_SERVER_SIDE_ENVIRONMENT_KEY) {
		console.warn(`FLAGSMITH_SERVER_SIDE_ENVIRONMENT_KEY not provided.`);
		return null;
	}

	const flagsmith = new Flagsmith({
		environmentKey: process.env.FLAGSMITH_SERVER_SIDE_ENVIRONMENT_KEY,
	});
	const flags = await flagsmith.getEnvironmentFlags();
	return flags;
};

const getFlag = async <F extends Flag>(flag: F) => {
	const flagsmith = await getFlagsmith();
	if (!flagsmith) {
		return defaultFlags[flag];
	}
	return flagsmith.getFlag(flag);
};

export const isFlagEnabled = async <F extends Flag>(flag: F) => {
	return (await getFlag(flag)).enabled;
};
