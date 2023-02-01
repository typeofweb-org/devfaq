import { HeadTags } from "../../../../../components/HeadTags";
import { stripMarkdown } from "../../../../../lib/markdown";
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

	const textForTitle = await stripMarkdown(data.question, { stripCode: true });
	const textForDescription = await stripMarkdown(data.question, { stripCode: false });

	return (
		<HeadTags
			title={textForTitle}
			description={textForDescription}
			og={{ questionId: questionId.toString() }}
		/>
	);
}
