import { Prisma } from "@prisma/client";
import { answerSelect } from "./answers.routes";

export const dbAnswerToDto = ({
	id,
	content,
	sources,
	createdAt,
	CreatedBy: { socialLogin, ...createdBy },
}: Prisma.QuestionAnswerGetPayload<{ select: typeof answerSelect }>) => {
	return {
		id,
		content,
		sources,
		createdAt: createdAt.toISOString(),
		createdBy: {
			socialLogin: socialLogin as Record<string, string | number>,
			...createdBy,
		},
	};
};
