import { use } from "react";
import { APIQuestion, serializeQuestionToMarkdown } from "../../lib/question";
import { Question } from "../Question/Question";
import { AdminPanelQuestionLeftSection } from "./AdminPanelQuestionLeftSection";

type AdminPanelQuestionsListProps = Readonly<{
	questions: APIQuestion[];
	refetchQuestions: () => void;
}>;

export const AdminPanelQuestionsList = ({
	questions,
	refetchQuestions,
}: AdminPanelQuestionsListProps) => {
	const serializedQuestions = questions.map((question) =>
		use(serializeQuestionToMarkdown(question)),
	);

	return (
		<ul className="w-full space-y-5">
			{serializedQuestions.map(({ _levelId, ...question }) => (
				<li key={question.id}>
					<Question
						level={_levelId}
						leftSection={
							<AdminPanelQuestionLeftSection
								id={question.id}
								status={question._statusId}
								refetchQuestions={refetchQuestions}
							/>
						}
						{...question}
					/>
				</li>
			))}
		</ul>
	);
};
