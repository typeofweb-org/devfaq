"use client";

import { useQuery } from "@tanstack/react-query";
import { getQuestionVotesById } from "../services/questions.service";
import { Question } from "../types";
import { QuestionItem } from "./QuestionsList/QuestionItem/QuestionItem";

type SingleQuestionProps = Readonly<{
	question: Question;
}>;

export const SingleQuestion = ({
	question: { id, question, _levelId, acceptedAt },
}: SingleQuestionProps) => {
	const { data, refetch } = useQuery({
		queryKey: ["votes", id],
		queryFn: () =>
			getQuestionVotesById({
				id,
			}),
	});

	const [votes, voted] = data?.data.data
		? [data.data.data.votesCount, data.data.data.currentUserVotedOn]
		: [0, false];

	return (
		<QuestionItem
			id={id}
			title={question}
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
