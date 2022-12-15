import { useQuery } from "@tanstack/react-query";
import { getQuestionsVotes } from "../services/questions.service";
import { QuestionFilter } from "../types";

export const useGetQuestionsVotes = (questionFilter: QuestionFilter) => {
	const { data, refetch } = useQuery({
		queryKey: ["votes", questionFilter],
		queryFn: () => getQuestionsVotes(questionFilter),
	});

	return { questionsVotes: data?.data.data, refetch };
};
