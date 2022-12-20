"use client";

import { Question as QuestionType } from "../types";
import { useGetQuestionVotesById } from "../hooks/useGetQuestionVotesById";
import { Question } from "./Question/Question";
import { QuestionVoting } from "./QuestionsList/QuestionVoting";

type SingleQuestionProps = Readonly<{
	question: QuestionType;
}>;

export const SingleQuestion = ({
	question: { id, mdxContent, _levelId, acceptedAt },
}: SingleQuestionProps) => {
	const { votes, voted, refetch } = useGetQuestionVotesById(id);

	return (
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
					onQuestionVote={() => {
						void refetch();
					}}
				/>
			}
		/>
	);
};
