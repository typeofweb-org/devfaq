import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
	downvoteQuestion,
	getQuestionsVotes,
	upvoteQuestion,
	getQuestionVotesById,
} from "../services/questions.service";
import { QuestionFilter, QuestionsVotes, QuestionVotes } from "../types";

function updateData<T extends { data: { data: unknown } }>(
	oldData: T | undefined,
	mapper: (item: T["data"]["data"]) => T["data"]["data"],
): T | undefined {
	if (!oldData) {
		return undefined;
	}

	return {
		...oldData,
		data: {
			...oldData.data,
			data: mapper(oldData.data.data),
		},
	};
}

const setUpvote =
	(variables: { id: number }) =>
	(questionVote: { id: number; votesCount: number; currentUserVotedOn: boolean }) => {
		if (questionVote.id === variables.id) {
			return {
				...questionVote,
				votesCount: questionVote.votesCount + 1,
				currentUserVotedOn: true,
			};
		}
		return questionVote;
	};
const setDownvote =
	(variables: { id: number }) =>
	(questionVote: { id: number; votesCount: number; currentUserVotedOn: boolean }) => {
		if (questionVote.id === variables.id) {
			return {
				...questionVote,
				votesCount: questionVote.votesCount - 1,
				currentUserVotedOn: false,
			};
		}
		return questionVote;
	};

export const useQuestionVoting = () => {
	const client = useQueryClient();

	const upvote = useMutation(upvoteQuestion, {
		onMutate: (variables) => {
			client.setQueriesData<{ data: QuestionsVotes }>(
				{ queryKey: ["questionsVotes"] },
				(oldData) => {
					return updateData(oldData, (item) => item.map(setUpvote(variables)));
				},
			);
			client.setQueriesData<{ data: QuestionVotes }>({ queryKey: ["questionVotes"] }, (oldData) => {
				return updateData(oldData, (item) => setUpvote(variables)(item));
			});
		},
	});
	const downvote = useMutation(downvoteQuestion, {
		onMutate: (variables) => {
			client.setQueriesData<{ data: QuestionsVotes }>(
				{ queryKey: ["questionsVotes"] },
				(oldData) => {
					return updateData(oldData, (item) => item.map(setDownvote(variables)));
				},
			);
			client.setQueriesData<{ data: QuestionVotes }>({ queryKey: ["questionVotes"] }, (oldData) => {
				return updateData(oldData, (item) => setDownvote(variables)(item));
			});
		},
	});

	return { upvote, downvote };
};

export const useGetQuestionVotesById = (id: number) => {
	const { data, refetch } = useQuery({
		queryKey: ["questionVotes", id],
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

export const useGetQuestionsVotes = (questionFilter: QuestionFilter) => {
	const { data, refetch } = useQuery({
		queryKey: ["questionsVotes", questionFilter],
		queryFn: () => getQuestionsVotes(questionFilter),
	});

	return { questionsVotes: data?.data.data, refetch };
};
