"use client";

import { twMerge } from "tailwind-merge";
import { useDevFAQRouter } from "../../hooks/useDevFAQRouter";
import { pluralize } from "../../utils/intl";
import { useQuestionVoting } from "../../hooks/useQuestionVoting";

type QuestionVotingProps = Readonly<{
	questionId: number;
	votes: number;
	voted: boolean;
	onQuestionVote: () => void;
}>;

const votesPluralize = pluralize("głos", "głosy", "głosów");

export const QuestionVoting = ({
	questionId,
	votes,
	voted,
	onQuestionVote,
}: QuestionVotingProps) => {
	const { upvote, downvote } = useQuestionVoting();
	const { requireLoggedIn } = useDevFAQRouter();

	const handleClick = () => {
		const mutation = !voted ? upvote : downvote;

		mutation.mutate(
			{
				id: questionId,
			},
			{
				onSuccess: onQuestionVote,
			},
		);
	};

	return (
		<button
			className={twMerge(
				"mr-1 mt-1 flex h-fit items-center gap-x-1.5 text-neutral-200 transition-colors md:mr-4",
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
