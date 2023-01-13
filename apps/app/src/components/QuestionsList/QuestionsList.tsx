"use client";

import { useGetQuestionsVotes } from "../../hooks/useQuestionVoting";
import { useUIContext } from "../../providers/UIProvider";
import { AdminQuestion, Question, QuestionFilter } from "../../types";
import { QuestionItem } from "../QuestionItem/QuestionItem";
import { QuestionLevel } from "../QuestionItem/QuestionLevel";
import { QuestionVoting } from "./QuestionVoting";
import { QuestionsManagement } from "./QuestionsManagment";

type QuestionsListProps = Readonly<{
	questions: AdminQuestion[];
	questionFilter: QuestionFilter;
}>;

export const QuestionsList = ({ questions, questionFilter }: QuestionsListProps) => {
	const { questionsVotes, refetch } = useGetQuestionsVotes(questionFilter);

	const onQuestionVote = () => {
		void refetch();
	};

	return (
		<ul className="space-y-10">
			{questions.map((question) => {
				const { id, mdxContent, _levelId, _categoryId, acceptedAt } = question;
				const questionVote = questionsVotes?.find(
					(questionVote) => questionVote.id === question.id,
				);
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
								<>
									<QuestionsManagement question={question} />
									<QuestionVoting
										questionId={id}
										votes={votes}
										voted={voted}
										onQuestionVote={onQuestionVote}
									/>
								</>
							}
							rightSection={<QuestionLevel level={_levelId} />}
						/>
					</li>
				);
			})}
		</ul>
	);
};
