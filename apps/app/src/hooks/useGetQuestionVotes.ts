import { useQuery } from "@tanstack/react-query";
import { getQuestionsVotes } from "../services/questions.service";
import { QuestionFilter } from "../types";
import { useUser } from "./useUser";

export const useGetQuestionVotes = ({
	questionId,
	questionFilter,
}: {
	questionId: number;
	questionFilter: QuestionFilter;
}) => {
	const { data, refetch } = useQuery({
		queryKey: ["votes", questionFilter],
		queryFn: () => getQuestionsVotes(questionFilter),
	});
	const { userData } = useUser();

	const question = data?.data.data.find(({ id }) => id === questionId);
	const votes = question ? question.votesCount : 0;
	const voted = userData && question ? question.currentUserVotedOn : false;

	return { votes, voted, refetch };
};
