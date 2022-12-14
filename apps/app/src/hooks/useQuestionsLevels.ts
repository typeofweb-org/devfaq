import { useSearchParams } from "next/navigation";
import { parseQueryLevels, Level } from "../lib/order";
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
			const index = queryLevels.indexOf(level);

			queryLevels.splice(index, 1);
			mergeQueryParams({ level: queryLevels.join(",") });
		}
	};

	return { queryLevels, addLevel, removeLevel };
};
