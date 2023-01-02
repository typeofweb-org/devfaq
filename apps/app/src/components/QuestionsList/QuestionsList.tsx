"use client";

import { useGetQuestionsVotes } from "../../hooks/useGetQuestionsVotes";
import { Question, QuestionFilter } from "../../types";
import { QuestionItem } from "../QuestionItem/QuestionItem";
import { QuestionVoting } from "./QuestionVoting";

type QuestionsListProps = Readonly<{
	questions: Question[];
	questionFilter: QuestionFilter;
}>;

export const QuestionsList = ({ questions, questionFilter }: QuestionsListProps) => {
	const { questionsVotes, refetch } = useGetQuestionsVotes(questionFilter);

	const onQuestionVote = () => {
		void refetch();
	};

	return (
		<ul className="space-y-10">
			{questions.map(({ id, mdxContent, _levelId, _categoryId, acceptedAt }) => {
				const questionVote = questionsVotes?.find((questionVote) => questionVote.id === id);
				const [votes, voted] = questionVote
					? [questionVote.votesCount, questionVote.currentUserVotedOn]
					: [0, false];

				return (
					<li key={id}>
						<QuestionItem
							id={id}
							mdxContent={mdxContent}
							level={_levelId}
							technology={_categoryId}
							acceptedAt={acceptedAt}
							leftSection={
								<QuestionVoting
									questionId={id}
									votes={votes}
									voted={voted}
									onQuestionVote={onQuestionVote}
								/>
							}
						/>
					</li>
				);
			})}
		</ul>
	);
};
