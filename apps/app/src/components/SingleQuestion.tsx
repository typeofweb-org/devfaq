"use client";

import { Question } from "../types";
import { useGetQuestionVotesById } from "../hooks/useGetQuestionVotesById";
import { QuestionItem } from "./QuestionsList/QuestionItem/QuestionItem";

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
