import { Prisma } from "@prisma/client";
import { answerSelect } from "./answers.routes";

export const dbAnswerToDto = ({
	id,
	content,
	sources,
	createdAt,
	QuestionAnswerVote,
	CreatedBy: { socialLogin, ...createdBy },
	_count,
}: Prisma.QuestionAnswerGetPayload<{ select: ReturnType<typeof answerSelect> }>) => {
	return {
		id,
		content,
		sources,
		createdAt: createdAt.toISOString(),
		votesCount: _count.QuestionAnswerVote,
		currentUserVotedOn: QuestionAnswerVote.length > 0,
		createdBy: {
			socialLogin: socialLogin as Record<string, string | number>,
			...createdBy,
		},
	};
};
