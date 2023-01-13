"use client";

import { AdminQuestion, Question } from "../types";
import { useGetQuestionVotesById } from "../hooks/useQuestionVoting";
import { QuestionItem } from "./QuestionItem/QuestionItem";
import { QuestionVoting } from "./QuestionsList/QuestionVoting";
import { QuestionTechnology } from "./QuestionItem/QuestionTechnology";
import { QuestionLevel } from "./QuestionItem/QuestionLevel";
import { QuestionsManagement } from "./QuestionsList/QuestionsManagment";

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
