"use client";

import { Suspense, useCallback } from "react";
import { useGetAllAnswers } from "../../hooks/useGetAllAnswers";
import { Order, AnswersOrderBy } from "../../lib/order";
import { Loading } from "../Loading";
import { AnswersList } from "./AnswersList";
import { FilterableAnswersList } from "./FilterableAnswersList";

type AnswersDashboardType = {
	page: number;
	orderBy?: AnswersOrderBy;
	order?: Order;
};

export const AnswersDashboard = ({ page, orderBy, order }: AnswersDashboardType) => {
	const { isSuccess, data, refetch } = useGetAllAnswers({
		page,
		orderBy,
		order,
	});

	const refetchAnswers = useCallback(() => {
		void refetch();
	}, [refetch]);

	return (
		<FilterableAnswersList
			total={data?.data.meta.total || 0}
			page={page}
			getHref={(page) => `/answers/${page}`}
			data={{ orderBy, order }}
		>
			{isSuccess && data.data.data.length > 0 ? (
				<Suspense fallback={<Loading label="ładowanie pytań" type="spinner" />}>
					<AnswersList answers={data.data.data} refetchAnswers={refetchAnswers} />
				</Suspense>
			) : (
				<p className="mt-10 text-2xl font-bold uppercase text-primary dark:text-neutral-200">
					Nie znaleziono żadnej odpowiedzi.
				</p>
			)}
		</FilterableAnswersList>
	);
};
