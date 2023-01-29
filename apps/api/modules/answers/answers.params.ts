import { Prisma } from "@prisma/client";
import { kv } from "../../utils.js";
import { GetAnswersQuery } from "./answers.schemas";

export const getAnswersPrismaParams = ({ limit, offset, order, orderBy }: GetAnswersQuery) => {
	return {
		take: limit,
		skip: offset,
		...(order &&
			orderBy && {
				orderBy: {
					...(orderBy === "votesCount"
						? {
								QuestionAnswerVote: {
									_count: order,
								},
						  }
						: kv(orderBy, order)),
				},
			}),
	} satisfies Prisma.QuestionAnswerFindManyArgs;
};
