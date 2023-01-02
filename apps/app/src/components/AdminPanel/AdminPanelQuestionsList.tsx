import { memo, use } from "react";
import { serializeQuestionToMarkdown } from "../../lib/question";
import { QuestionItem } from "../QuestionItem/QuestionItem";
import type { APIQuestion } from "../../types";
import { AdminPanelQuestionLeftSection } from "./AdminPanelQuestionLeftSection";

type AdminPanelQuestionsListProps = Readonly<{
	questions: APIQuestion[];
	refetchQuestions: () => void;
}>;

export const AdminPanelQuestionsList = memo(
	({ questions, refetchQuestions }: AdminPanelQuestionsListProps) => {
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
								<AdminPanelQuestionLeftSection
									question={question}
									refetchQuestions={refetchQuestions}
								/>
							}
							{...question}
						/>
					</li>
				))}
			</ul>
		);
	},
);

AdminPanelQuestionsList.displayName = "AdminPanelQuestionsList";
