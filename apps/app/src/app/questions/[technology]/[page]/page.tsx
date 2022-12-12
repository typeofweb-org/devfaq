import { redirect } from "next/navigation";
import { QuestionItem } from "../../../../components/QuestionItem/QuestionItem";
import { QuestionsHeader } from "../../../../components/QuestionsHeader/QuestionsHeader";
import { QuestionsPagination } from "../../../../components/QuestionsPagination";
import { PAGE_SIZE } from "../../../../lib/constants";
import { validateOrder, validateOrderBy, DEFAULT_ORDER_QUERY } from "../../../../lib/order";
import { technologies, Technology } from "../../../../lib/technologies";
import { getAllQuestions } from "../../../../services/questions.service";

export default async function QuestionsPage({
	params,
	searchParams,
}: {
	params: { technology: Technology; page: string };
	searchParams?: { sortBy?: string };
}) {
	const page = parseInt(params.page);
	const [orderBy, order] = (searchParams?.sortBy || DEFAULT_ORDER_QUERY).split("*");

	if (!technologies.includes(params.technology) || isNaN(page)) {
		return redirect("/");
	}

	const { data } = await getAllQuestions({
		category: params.technology,
		limit: PAGE_SIZE,
		offset: (page - 1) * PAGE_SIZE,
		...(validateOrderBy(orderBy) && { orderBy }),
		...(validateOrder(order) && { order }),
	});

	return (
		<div className="flex flex-col gap-y-10">
			<QuestionsHeader technology={params.technology} total={data.meta.total} />
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
			<QuestionsPagination technology={params.technology} total={data.meta.total} />
		</div>
	);
}
