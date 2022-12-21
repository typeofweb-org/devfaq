import { memo, use } from "react";
import { APIQuestion, serializeQuestionToMarkdown } from "../../lib/question";
import { QuestionItem } from "../QuestionItem/QuestionItem";
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
					const serializedQuestion = await serializeQuestionToMarkdown(question);
					return { content: question.question, ...serializedQuestion };
				})(),
			),
		);

		return (
			<ul className="w-full space-y-5">
				{serializedQuestions.map((question) => (
					<li key={question.id}>
						<QuestionItem
							level={question._levelId}
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
