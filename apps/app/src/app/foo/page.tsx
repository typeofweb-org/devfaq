import { QuestionItem } from "../../components/QuestionItem/QuestionItem";
import { getAllQuestions } from "../../services/questions.service";

export default async function FooPage() {
	const { data } = await getAllQuestions({ limit: 20 });

	return (
		<div className="flex flex-col gap-y-10 p-10">
			{data.data.map(({ id, question, _levelId, acceptedAt, votesCount }) => (
				<QuestionItem
					key={id}
					title={question}
					level={_levelId as "junior"}
					creationDate={new Date(acceptedAt || "")}
					votes={votesCount}
					voted={id % 2 === 0}
				/>
			))}
		</div>
	);
}
