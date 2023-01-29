import { useQuery } from "@tanstack/react-query";
import { PAGE_SIZE } from "../lib/constants";
import { getAllAnswers } from "../services/answers.service";

export const useGetAllAnswers = ({ page }: { page: number }) => {
	const query = useQuery({
		queryKey: ["answers", { page }],
		queryFn: () =>
			getAllAnswers({
				limit: PAGE_SIZE,
				offset: (page - 1) * PAGE_SIZE,
			}),
		keepPreviousData: true,
	});

	return query;
};
