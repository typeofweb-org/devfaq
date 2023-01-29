"use client";

import { Suspense, useCallback } from "react";
import { useGetAllAnswers } from "../../hooks/useGetAllAnswers";
import { Loading } from "../Loading";
import { QuestionsPagination } from "../QuestionsPagination/QuestionsPagination";
import { AnswersDashboardHeader } from "./AnswersDashboardHeader";
import { AnswersList } from "./AnswersList";

type AnswersDashboardType = {
	page: number;
};

export const AnswersDashboard = ({ page }: AnswersDashboardType) => {
	const { isSuccess, data, refetch } = useGetAllAnswers({
		page,
	});

	const refetchAnswers = useCallback(() => {
		void refetch();
	}, [refetch]);

	return (
		<ul className="my-10 flex flex-col gap-y-10">
			<AnswersDashboardHeader />
			{isSuccess && data.data.data.length > 0 ? (
				<Suspense fallback={<Loading label="ładowanie pytań" type="spinner" />}>
					<AnswersList answers={data.data.data} refetchAnswers={refetchAnswers} />
				</Suspense>
			) : (
				<p className="mt-10 text-2xl font-bold uppercase text-primary dark:text-neutral-200">
					Nie znaleziono żadnej odpowiedzi.
				</p>
			)}
			<QuestionsPagination
				current={page}
				total={data?.data.meta.total || 0}
				getHref={(page) => `/answers/${page}`}
			/>
		</ul>
	);
};
