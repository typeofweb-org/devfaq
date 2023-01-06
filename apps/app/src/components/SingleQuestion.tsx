"use client";

import { Question } from "../types";
import { useGetQuestionVotesById } from "../hooks/useQuestionVoting";
import { QuestionItem } from "./QuestionItem/QuestionItem";
import { QuestionVoting } from "./QuestionsList/QuestionVoting";
import { QuestionTechnology } from "./QuestionItem/QuestionTechnology";

type SingleQuestionProps = Readonly<{
	question: Question;
}>;

export const SingleQuestion = ({
	question: { id, mdxContent, _levelId, _categoryId, acceptedAt },
}: SingleQuestionProps) => {
	const { votes, voted, refetch } = useGetQuestionVotesById(id);

	return (
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
					onQuestionVote={() => {
						void refetch();
					}}
				/>
			}
			rightSection={<QuestionTechnology technology={_categoryId} />}
		/>
	);
};
