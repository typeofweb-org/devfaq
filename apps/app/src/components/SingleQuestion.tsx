"use client";

import dynamic from "next/dynamic";
import { AdminQuestion } from "../types";
import { useGetQuestionVotesById } from "../hooks/useQuestionVoting";
import { QuestionItem } from "./QuestionItem/QuestionItem";
import { QuestionVoting } from "./QuestionsList/QuestionVoting";
import { QuestionTechnology } from "./QuestionItem/QuestionTechnology";
import { QuestionLevel } from "./QuestionItem/QuestionLevel";

const QuestionsManagement = dynamic(
	() =>
		import("../components/QuestionsList/QuestionsManagment").then((mod) => mod.QuestionsManagement),
	{
		ssr: false,
	},
);

type SingleQuestionProps = Readonly<{
	question: AdminQuestion;
}>;

export const SingleQuestion = ({ question }: SingleQuestionProps) => {
	const { id, mdxContent, _levelId, _categoryId, acceptedAt } = question;
	const { votes, voted, refetch } = useGetQuestionVotesById(id);

	return (
		<QuestionItem
			id={id}
			mdxContent={mdxContent}
			level={_levelId}
			technology={_categoryId}
			acceptedAt={acceptedAt}
			leftSection={
				<div className="flex flex-col gap-1.5">
					<QuestionVoting
						questionId={id}
						votes={votes}
						voted={voted}
						onQuestionVote={() => {
							void refetch();
						}}
					/>
					<QuestionsManagement question={question} />
				</div>
			}
			rightSection={
				<div className="flex flex-col items-center">
					<QuestionTechnology technology={_categoryId} />
					<QuestionLevel level={_levelId} />
				</div>
			}
		/>
	);
};
