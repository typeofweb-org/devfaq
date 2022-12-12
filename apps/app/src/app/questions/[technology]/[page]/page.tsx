import { redirect } from "next/navigation";
import { QuestionItem } from "../../../../components/QuestionItem/QuestionItem";
import { QuestionsPagination } from "../../../../components/QuestionsPagination";
import { PAGE_SIZE } from "../../../../lib/constants";
import { technologies } from "../../../../lib/technologies";
import { getAllQuestions } from "../../../../services/questions.service";

export default async function QuestionsPage({
	params,
}: {
	params: { technology: string; page: string };
}) {
	const page = parseInt(params.page);

	if (!technologies.includes(params.technology) || isNaN(page)) {
		return redirect("/");
	}

	const { data } = await getAllQuestions({
		category: params.technology,
		limit: PAGE_SIZE,
		offset: (page - 1) * PAGE_SIZE,
	});

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
			<QuestionsPagination total={data.meta.total} />
		</div>
	);
}
