"use client";

import { use } from "react";
import { serializeQuestionToMarkdown } from "../../lib/question";
import { APIQuestion } from "../../types";
import { Button } from "../Button/Button";
import { QuestionItem } from "../QuestionItem/QuestionItem";
import { QuestionLevel } from "../QuestionItem/QuestionLevel";
import { QuestionTechnology } from "../QuestionItem/QuestionTechnology";
import PencilIcon from "../../../public/icons/pencil.svg";
import { useUIContext } from "../../providers/UIProvider";

type UserQuestionsListProps = Readonly<{
	questions: APIQuestion[];
}>;

export const UserQuestionsList = ({ questions }: UserQuestionsListProps) => {
	const { openModal } = useUIContext();
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
							<Button
								variant="branding"
								className="m-px my-auto flex h-fit w-24 min-w-0 items-center justify-center gap-2 p-0"
								onClick={() => openModal("AddQuestionModal", question)}
							>
								<PencilIcon className="fill-violet-700 dark:fill-neutral-200" />
								Edytuj
							</Button>
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
};
