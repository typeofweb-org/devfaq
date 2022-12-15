"use client";

import { useQuery } from "@tanstack/react-query";
import { getQuestionsVotes } from "../../services/questions.service";
import { Question, QuestionFilter } from "../../types";
import { QuestionItem } from "./QuestionItem/QuestionItem";

type QuestionsListProps = Readonly<{
	questions: Question[];
	questionFilter: QuestionFilter;
}>;

export const QuestionsList = ({ questions, questionFilter }: QuestionsListProps) => {
	const { data, refetch } = useQuery({
		queryKey: ["votes", questionFilter],
		queryFn: () => getQuestionsVotes(questionFilter),
	});

	const onQuestionVote = () => {
		void refetch();
	};

	return (
		<>
			{questions.map(({ id, question, _levelId, acceptedAt }) => {
				const questionVote = data?.data.data.find((questionVote) => questionVote.id === id);
				const [votes, voted] = questionVote
					? [questionVote.votesCount, questionVote.currentUserVotedOn]
					: [0, false];

				return (
					<QuestionItem
						key={id}
						id={id}
						title={question}
						level={_levelId}
						creationDate={new Date(acceptedAt || "")}
						votes={votes}
						voted={voted}
						onQuestionVote={onQuestionVote}
					/>
				);
			})}
		</>
	);
};
