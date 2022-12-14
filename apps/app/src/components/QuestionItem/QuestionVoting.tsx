"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";
import { useSearchParams } from "next/navigation";
import { useDevFAQRouter } from "../../hooks/useDevFAQRouter";
import { useUser } from "../../hooks/useUser";
import {
	downvoteQuestion,
	getQuestionsVotes,
	upvoteQuestion,
} from "../../services/questions.service";
import { pluralize } from "../../utils/intl";
import { Technology } from "../../lib/technologies";
import { PAGE_SIZE } from "../../lib/constants";
import { DEFAULT_SORT_BY_QUERY, getQuerySortBy } from "../../lib/order";

type QuestionVotingProps = Readonly<{
	questionId: number;
	page: number;
	technology: Technology;
}>;

const votesPluralize = pluralize("głos", "głosy", "głosów");

export const QuestionVoting = ({ questionId, page, technology }: QuestionVotingProps) => {
	const searchParams = useSearchParams();
	const querySortBy = getQuerySortBy(searchParams.get("sortBy") || DEFAULT_SORT_BY_QUERY);

	const { data, refetch } = useQuery({
		queryKey: ["votes"],
		queryFn: () =>
			getQuestionsVotes({
				category: technology,
				limit: PAGE_SIZE,
				offset: (page - 1) * PAGE_SIZE,
				orderBy: querySortBy?.orderBy,
				order: querySortBy?.order,
			}),
	});

	const upvoteQuestionMutation = useMutation(upvoteQuestion);
	const downvoteQuestionMutation = useMutation(downvoteQuestion);
	const { userData } = useUser();
	const { redirectToLoginPage } = useDevFAQRouter();

	const question = data?.data.data.find(({ id }) => id === questionId);
	const votes = question ? question.votesCount : 0;
	const voted = userData && question ? question.currentUserVotedOn : false;

	const handleClick = () => {
		if (!userData) {
			return redirectToLoginPage();
		}

		const mutation = voted ? downvoteQuestionMutation : upvoteQuestionMutation;

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
			onClick={handleClick}
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
