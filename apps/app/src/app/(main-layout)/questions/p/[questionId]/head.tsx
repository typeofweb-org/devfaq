import { HeadTags } from "../../../../../components/HeadTags";
import { getQuestionById } from "../../../../../services/questions.service";
import { Params } from "../../../../../types";

export default async function Head({ params }: { params: Params<"questionId"> }) {
	const questionId = Number.parseInt(params.questionId);

	if (Number.isNaN(questionId)) {
		return <HeadTags />;
	}

	const {
		data: { data },
	} = await getQuestionById({
		id: questionId,
	});

	return <HeadTags title={data.question} />;
}
