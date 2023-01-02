import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { downvoteQuestion, getQuestionsVotes, upvoteQuestion } from "../services/questions.service";
import { QuestionFilter, QuestionsVotes } from "../types";

export const useQuestionVoting = () => {
	const client = useQueryClient();

	const upvote = useMutation(upvoteQuestion, {
		onMutate: (variables) => {
			client.setQueriesData<{ data: QuestionsVotes }>({ queryKey: ["votes"] }, (oldData) => {
				if (!oldData) {
					return undefined;
				}

				return {
					...oldData,
					data: {
						...oldData.data,
						data: oldData.data.data.map((questionVote) => {
							if (questionVote.id === variables.id) {
								return {
									...questionVote,
									votesCount: questionVote.votesCount + 1,
									currentUserVotedOn: true,
								};
							}
							return questionVote;
						}),
					},
				};
			});
		},
	});
	const downvote = useMutation(downvoteQuestion, {
		onMutate: (variables) => {
			client.setQueriesData<{ data: QuestionsVotes }>({ queryKey: ["votes"] }, (oldData) => {
				if (!oldData) {
					return undefined;
				}

				return {
					...oldData,
					data: {
						...oldData.data,
						data: oldData.data.data.map((questionVote) => {
							if (questionVote.id === variables.id) {
								return {
									...questionVote,
									votesCount: questionVote.votesCount - 1,
									currentUserVotedOn: false,
								};
							}
							return questionVote;
						}),
					},
				};
			});
		},
	});

	return { upvote, downvote };
};

export const useGetQuestionsVotes = (questionFilter: QuestionFilter) => {
	const { data, refetch } = useQuery({
		queryKey: ["votes", questionFilter],
		queryFn: () => getQuestionsVotes(questionFilter),
	});

	return { questionsVotes: data?.data.data, refetch };
};
