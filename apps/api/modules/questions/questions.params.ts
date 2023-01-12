import { Prisma } from "@prisma/client";
import { kv } from "../../utils.js";
import { GetQuestionsQuery } from "./questions.schemas.js";

export const getQuestionsPrismaParams = (
	{
		category,
		level,
		status = "accepted",
		limit,
		offset,
		order,
		orderBy,
		userId,
	}: GetQuestionsQuery,
	userRole: string | undefined,
) => {
	const levels = level?.split(",");

	return {
		where: {
			...(category && { categoryId: category }),
			...(levels && { levelId: { in: levels } }),
			...(status && userRole === "admin" ? { statusId: status } : { statusId: "accepted" }),
			...(userId && { createdById: userId }),
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
						: orderBy === "level"
						? { levelId: order }
						: kv(orderBy, order)),
				},
			}),
	} satisfies Prisma.QuestionFindManyArgs;
};
