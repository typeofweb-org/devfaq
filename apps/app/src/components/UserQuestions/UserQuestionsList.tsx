"use client";

import { memo, use } from "react";
import { serializeQuestionToMarkdown } from "../../lib/question";
import { APIQuestion } from "../../types";
import { QuestionItem } from "../QuestionItem/QuestionItem";
import { QuestionLevel } from "../QuestionItem/QuestionLevel";
import { QuestionTechnology } from "../QuestionItem/QuestionTechnology";
import { UserQuestionLeftSection } from "./UserQuestionLeftSection";

type UserQuestionsListProps = Readonly<{
	questions: APIQuestion[];
	refetchQuestions: () => void;
}>;

export const UserQuestionsList = memo(({ questions, refetchQuestions }: UserQuestionsListProps) => {
	const serializedQuestions = questions.map((question) =>
		use(
			(async () => {
				const { mdxContent } = await serializeQuestionToMarkdown(question);
				return { ...question, mdxContent };
			})(),
		),
	);

	return (
		<ul className="w-full space-y-5">
			{serializedQuestions.map((question) => (
				<li key={question.id}>
					<QuestionItem
						level={question._levelId}
						technology={question._categoryId}
						leftSection={
							<UserQuestionLeftSection question={question} refetchQuestions={refetchQuestions} />
						}
						rightSection={
							<div className="flex flex-col items-center">
								<QuestionTechnology technology={question._categoryId} />
								<QuestionLevel level={question._levelId} />
							</div>
						}
						{...question}
					/>
				</li>
			))}
		</ul>
	);
});

UserQuestionsList.displayName = "UserQuestionsList";
