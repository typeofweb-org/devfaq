"use client";

import { useQuery } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";
import { MouseEvent } from "react";
import { useDevFAQRouter } from "../../hooks/useDevFAQRouter";
import { getQuestionsVotes } from "../../services/questions.service";
import { pluralize } from "../../utils/intl";
import { QuestionFilter } from "../../types";
import { useQuestionVoting } from "../../hooks/useQuestionVoting";
import { useUser } from "../../hooks/useUser";

type QuestionVotingProps = Readonly<{
	questionId: number;
	questionFilter: QuestionFilter;
}>;

const votesPluralize = pluralize("głos", "głosy", "głosów");

export const QuestionVoting = ({ questionId, questionFilter }: QuestionVotingProps) => {
	const { data, refetch } = useQuery({
		queryKey: ["votes", questionFilter],
		queryFn: () => getQuestionsVotes(questionFilter),
	});
	const { upvote, downvote } = useQuestionVoting();
	const { requireLoggedIn } = useDevFAQRouter();
	const { userData } = useUser();

	const question = data?.data.data.find(({ id }) => id === questionId);
	const votes = question ? question.votesCount : 0;
	const voted = userData && question ? question.currentUserVotedOn : false;

	const handleClick = () => {
		const mutation = !voted ? upvote : downvote;

		mutation.mutate(
			{
				id: questionId,
			},
			{
				onSuccess: () => {
					void refetch();
				},
			},
		);
	};

	return (
		<button
			className={twMerge(
				"mr-4 flex h-fit items-center gap-x-1.5 text-neutral-200 transition-colors",
				voted && "text-violet-700 dark:text-violet-300",
			)}
			type="button"
			aria-label={`To pytanie ma ${votes} ${votesPluralize(votes)}. Kliknij, aby ${
				voted ? "usunąć" : "dodać"
			} swój głos.`}
			onClick={requireLoggedIn(handleClick)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				version="1.1"
				width="15"
				height="13"
				fill="currentColor"
				className={twMerge("transition-transform duration-300", voted ? "rotate-180" : "rotate-0")}
			>
				<polygon points="7.5,0 15,13 0,13" />
			</svg>
			{votes}
		</button>
	);
};
