"use client";

import { useGetQuestionsVotes } from "../../hooks/useGetQuestionsVotes";
import { Question as QuestionType, QuestionFilter } from "../../types";
import { Question } from "../Question/Question";
import { QuestionVoting } from "./QuestionVoting";

type QuestionsListProps = Readonly<{
	questions: QuestionType[];
	questionFilter: QuestionFilter;
}>;

export const QuestionsList = ({ questions, questionFilter }: QuestionsListProps) => {
	const { questionsVotes, refetch } = useGetQuestionsVotes(questionFilter);

	const onQuestionVote = () => {
		void refetch();
	};

	return (
		<ul className="space-y-10">
			{questions.map(({ id, mdxContent, _levelId, acceptedAt }) => {
				const questionVote = questionsVotes?.find((questionVote) => questionVote.id === id);
				const [votes, voted] = questionVote
					? [questionVote.votesCount, questionVote.currentUserVotedOn]
					: [0, false];

				return (
					<li key={id}>
						<Question
							id={id}
							mdxContent={mdxContent}
							level={_levelId}
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
