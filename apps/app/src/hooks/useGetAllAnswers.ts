import { useQuery } from "@tanstack/react-query";
import { PAGE_SIZE } from "../lib/constants";
import { AnswersOrderBy, Order } from "../lib/order";
import { getAllAnswers } from "../services/answers.service";

export const useGetAllAnswers = ({
	page,
	orderBy,
	order,
}: {
	page: number;
	orderBy?: AnswersOrderBy;
	order?: Order;
}) => {
	const query = useQuery({
		queryKey: ["answers", { page, order, orderBy }],
		queryFn: () =>
			getAllAnswers({
				limit: PAGE_SIZE,
				offset: (page - 1) * PAGE_SIZE,
				orderBy,
				order,
			}),
		keepPreviousData: true,
	});

	return query;
};
