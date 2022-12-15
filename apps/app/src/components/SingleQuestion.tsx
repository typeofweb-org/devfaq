"use client";

import { Question } from "../types";
import { QuestionItem } from "./QuestionsList/QuestionItem/QuestionItem";
import { useGetQuestionVotesById } from "./useGetQuestionVotesById";

type SingleQuestionProps = Readonly<{
	question: Question;
}>;

export const SingleQuestion = ({
	question: { id, mdxContent, _levelId, acceptedAt },
}: SingleQuestionProps) => {
	const { votes, voted, refetch } = useGetQuestionVotesById(id);

	return (
		<QuestionItem
			id={id}
			mdxContent={mdxContent}
			level={_levelId}
			creationDate={new Date(acceptedAt || "")}
			votes={votes}
			voted={voted}
			onQuestionVote={() => {
				void refetch();
			}}
		/>
	);
};
