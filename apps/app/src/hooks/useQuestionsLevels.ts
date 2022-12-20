import { useSearchParams } from "next/navigation";
import { parseQueryLevels, Level } from "../lib/level";
import { useDevFAQRouter } from "./useDevFAQRouter";
import { useDefaultQuestionsPathname } from "./useDefaultQuestionsPathname";

export const useQuestionsLevels = () => {
	const searchParams = useSearchParams();
	const { mergeQueryParams } = useDevFAQRouter();
	const { defaultPathname } = useDefaultQuestionsPathname();

	const queryLevel = searchParams.get("level");
	const queryLevels = parseQueryLevels(queryLevel);

	const addLevel = (level: Level) => {
		mergeQueryParams({ level: [...(queryLevels || []), level].join(",") }, defaultPathname);
	};

	const removeLevel = (level: Level) => {
		if (queryLevels) {
			const newQueryLevels = queryLevels.filter((l) => l !== level);

			mergeQueryParams({ level: newQueryLevels.join(",") }, defaultPathname);
		}
	};

	return { queryLevels, addLevel, removeLevel };
};
