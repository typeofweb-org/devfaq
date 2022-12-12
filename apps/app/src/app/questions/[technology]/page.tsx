import { redirect } from "next/navigation";
import { QuestionItem } from "../../../components/QuestionItem/QuestionItem";
import { technologies } from "../../../lib/technologies";
import { getAllQuestions } from "../../../services/questions.service";

export default async function QuestionsPage({ params }: { params: { technology: string } }) {
	if (!technologies.includes(params.technology)) {
		return redirect("/");
	}

	const { data } = await getAllQuestions({ category: params.technology, limit: 20 });

	return (
		<div className="flex flex-col gap-y-10">
			{data.data.map(({ id, question, _levelId, acceptedAt, votesCount }) => (
				<QuestionItem
					key={id}
					title={question}
					level={_levelId}
					creationDate={new Date(acceptedAt || "")}
					votes={votesCount}
					voted={id % 2 === 0}
				/>
			))}
		</div>
	);
};
