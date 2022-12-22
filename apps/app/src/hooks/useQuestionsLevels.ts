import { useSearchParams } from "next/navigation";
import { parseQueryLevels, Level } from "../lib/level";

export const useQuestionsLevels = () => {
	const searchParams = useSearchParams();

	const queryLevel = searchParams.get("level");
	const queryLevels = parseQueryLevels(queryLevel) || [];

	const addLevel = (level: Level) => {
		return [...queryLevels, level].join(",");
	};

	const removeLevel = (level: Level) => {
		const newQueryLevels = queryLevels.filter((l) => l !== level);

		return newQueryLevels.join(",");
	};

	return { queryLevels, addLevel, removeLevel };
};
