"use client";

import { Suspense, useCallback } from "react";
import { useGetAllQuestions } from "../../hooks/useGetAllQuestions";
import { Level } from "../../lib/level";
import { Order, OrderBy } from "../../lib/order";
import { QuestionStatus } from "../../lib/question";
import { Technology } from "../../lib/technologies";
import { FilterableQuestionsList } from "../FilterableQuestionsList/FilterableQuestionsList";
import { Loading } from "../Loading";
import { AdminPanelQuestionsList } from "./AdminPanelQuestionsList";

type AdminPanelProps = Readonly<{
	page: number;
	technology: Technology | null;
	levels: Level[] | null;
	status: QuestionStatus;
	order?: Order;
	orderBy?: OrderBy;
}>;

export const AdminPanel = ({
	page,
	technology,
	levels,
	status,
	order,
	orderBy,
}: AdminPanelProps) => {
	const { isSuccess, data, refetch } = useGetAllQuestions({
		page,
		status,
		technology,
		levels,
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
			getHref={(page) => `/admin/${status}/${page}`}
			data={{ status, technology, levels, order, orderBy }}
		>
			{isSuccess && data.data.data.length > 0 ? (
				<Suspense fallback={<Loading label="ładowanie pytań" type="article" admin />}>
					<AdminPanelQuestionsList questions={data.data.data} refetchQuestions={refetchQuestions} />
				</Suspense>
			) : (
				<p className="mt-10 text-2xl font-bold uppercase text-primary dark:text-neutral-200">
					{status === "accepted"
						? "Nie znaleziono żadnego pytania"
						: "Brak pytań do zaakceptowania"}
				</p>
			)}
		</FilterableQuestionsList>
	);
};
