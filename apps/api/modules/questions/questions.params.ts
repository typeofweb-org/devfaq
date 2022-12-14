import { Prisma } from "@prisma/client";
import { GetQuestionsQuery } from "./questions.schemas";

export const getQuestionsPrismaParams = (
	{ category, level, status = "accepted", limit, offset, order, orderBy }: GetQuestionsQuery,
	userRole: string | undefined,
) => {
	const levels = level?.split(",");

	return {
		where: {
			...(category && { categoryId: category }),
			...(levels && { levelId: { in: levels } }),
			...(status && userRole === "admin" ? { statusId: status } : { statusId: "accepted" }),
		},
		take: limit,
		skip: offset,
		...(order &&
			orderBy && {
				orderBy: {
					...(orderBy === "votesCount"
						? {
								QuestionVote: {
									_count: order,
								},
						  }
						: {
								[orderBy]: order,
						  }),
				},
			}),
	} satisfies Prisma.QuestionFindManyArgs;
};
