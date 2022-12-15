import { useQuery } from "@tanstack/react-query";
import { getQuestionVotesById } from "../services/questions.service";

export const useGetQuestionVotesById = (id: number) => {
	const { data, refetch } = useQuery({
		queryKey: ["votes", id],
		queryFn: () =>
			getQuestionVotesById({
				id,
			}),
	});

	const [votes, voted] = data?.data.data
		? [data.data.data.votesCount, data.data.data.currentUserVotedOn]
		: [0, false];

	return { votes, voted, refetch };
};
