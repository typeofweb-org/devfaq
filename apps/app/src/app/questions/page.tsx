import { QuestionItem } from "../../components/QuestionItem/QuestionItem";
import { getAllQuestions } from "../../services/questions.service";

const QuestionsPage = async () => {
	const { data } = await getAllQuestions({ limit: 20 });

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

export default QuestionsPage;
