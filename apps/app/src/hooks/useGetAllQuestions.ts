import { useQuery } from "@tanstack/react-query";
import { PAGE_SIZE } from "../lib/constants";
import { Level } from "../lib/level";
import { Order, OrderBy } from "../lib/order";
import { QuestionStatus } from "../lib/question";
import { Technology } from "../lib/technologies";
import { getAllQuestions } from "../services/questions.service";

export const useGetAllQuestions = ({
	page,
	technology,
	levels,
	status,
	userId,
	order,
	orderBy,
}: {
	page: number;
	technology: Technology | null;
	levels: Level[] | null;
	status?: QuestionStatus;
	userId?: number;
	order?: Order;
	orderBy?: OrderBy;
}) => {
	const query = useQuery({
		queryKey: ["questions", { page, technology, levels, status, userId, order, orderBy }],
		queryFn: () =>
			getAllQuestions({
				limit: PAGE_SIZE,
				offset: (page - 1) * PAGE_SIZE,
				...(technology && { category: technology }),
				...(levels && { level: levels.join(",") }),
				status,
				userId,
				order,
				orderBy,
			}),
		keepPreviousData: true,
	});

	return query;
};
