"use client";

import { Suspense, useCallback } from "react";
import { useGetAllQuestions } from "../../hooks/useGetAllQuestions";
import { useUser } from "../../hooks/useUser";
import { Order, OrderBy } from "../../lib/order";
import { Technology } from "../../lib/technologies";
import { FilterableQuestionsList } from "../FilterableQuestionsList/FilterableQuestionsList";
import { Loading } from "../Loading";
import { Level } from "../QuestionItem/QuestionLevel";
import { UserQuestionsList } from "./UserQuestionsList";

type UserQuestionsProps = Readonly<{
	page: number;
	technology: Technology | null;
	levels: Level[] | null;
	order?: Order;
	orderBy?: OrderBy;
}>;

export const UserQuestions = ({ page, technology, levels, order, orderBy }: UserQuestionsProps) => {
	const { userData } = useUser();
	const { isSuccess, data, refetch } = useGetAllQuestions({
		page,
		technology,
		levels,
		userId: userData?._user.id,
		order,
		orderBy,
	});

	const refetchQuestions = useCallback(() => {
		void refetch();
	}, [refetch]);

	return (
		<FilterableQuestionsList
			page={page}
			total={data?.data.meta.total || 0}
			getHref={(page) => `/user/questions/${page}`}
			data={{ technology, levels, order, orderBy }}
		>
			{isSuccess && data.data.data.length > 0 ? (
				<Suspense
					fallback={<Loading label="ładowanie pytań" type="article" withTechnology admin />}
				>
					<UserQuestionsList questions={data.data.data} refetchQuestions={refetchQuestions} />
				</Suspense>
			) : (
				<p className="mt-10 text-center text-2xl font-bold uppercase text-primary dark:text-neutral-200">
					Nie dodano żadnego pytania
				</p>
			)}
		</FilterableQuestionsList>
	);
};
