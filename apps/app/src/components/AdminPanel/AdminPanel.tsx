"use client";

import { Suspense, useCallback } from "react";
import { useGetAllQuestions } from "../../hooks/useGetAllQuestions";
import { Level } from "../../lib/level";
import { QuestionStatus } from "../../lib/question";
import { Technology } from "../../lib/technologies";
import { QuestionsPagination } from "../QuestionsPagination";
import { AdminPanelHeader } from "./AdminPanelHeader";
import { AdminPanelQuestionsList } from "./AdminPanelQuestionsList";

type AdminPanelProps = Readonly<{
	page: number;
	technology: Technology | null;
	levels: Level[] | null;
	status: QuestionStatus;
}>;

export const AdminPanel = ({ page, technology, levels, status }: AdminPanelProps) => {
	const { isSuccess, data, refetch } = useGetAllQuestions({
		page,
		status,
		technology,
		levels,
	});

	const refetchQuestions = useCallback(() => {
		void refetch();
	}, [refetch]);

	return (
		<>
			<AdminPanelHeader status={status} technology={technology} levels={levels} />
			{isSuccess ? (
				<>
					<Suspense>
						<AdminPanelQuestionsList
							questions={data.data.data}
							refetchQuestions={refetchQuestions}
						/>
					</Suspense>
					<QuestionsPagination
						total={data.data.meta.total}
						getHref={(page) => `/admin/${status}/${page}`}
					/>
				</>
			) : null}
		</>
	);
};
