import { useSearchParams } from "next/navigation";
import { parseQueryLevels, Level } from "../lib/level";
import { useDevFAQRouter } from "./useDevFAQRouter";

export const useQuestionsLevels = () => {
	const searchParams = useSearchParams();
	const { mergeQueryParams } = useDevFAQRouter();

	const queryLevel = searchParams.get("level");
	const queryLevels = parseQueryLevels(queryLevel);

	const addLevel = (level: Level) => {
		mergeQueryParams({ level: [...(queryLevels || []), level].join(",") });
	};

	const removeLevel = (level: Level) => {
		if (queryLevels) {
			const newQueryLevels = queryLevels.filter((l) => l !== level);

			mergeQueryParams({ level: newQueryLevels.join(",") });
		}
	};

	return { queryLevels, addLevel, removeLevel };
};
