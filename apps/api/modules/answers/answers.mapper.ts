import { Prisma } from "@prisma/client";
import { answerSelect } from "./answers.routes";

export const dbAnswerToDto = ({
	createdAt,
	CreatedBy: { socialLogin, ...createdBy },
	...rest
}: Prisma.QuestionAnswerGetPayload<{ select: typeof answerSelect }>) => {
	return {
		createdAt: createdAt.toISOString(),
		createdBy: {
			socialLogin: socialLogin as Record<string, string | number>,
			...createdBy,
		},
		...rest,
	};
};
