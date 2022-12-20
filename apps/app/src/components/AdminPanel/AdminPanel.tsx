"use client";

import { isError, useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { PAGE_SIZE } from "../../lib/constants";
import { Level } from "../../lib/level";
import { QuestionStatus } from "../../lib/question";
import { Technology } from "../../lib/technologies";
import { getAllQuestions } from "../../services/questions.service";
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
	const { isSuccess, isLoading, data, refetch } = useQuery({
		queryKey: ["questions", { page, status, technology, levels }],
		queryFn: () =>
			getAllQuestions({
				limit: PAGE_SIZE,
				offset: (page - 1) * PAGE_SIZE,
				status,
				...(technology && { category: technology }),
				...(levels && { level: levels.join(",") }),
			}),
	});
	const pathname = usePathname();

	const refetchQuestions = () => {
		void refetch();
	};

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
						getHref={(i) => ({
							pathname,
							query: { page: i + 1 },
						})}
					/>
				</>
			) : isLoading ? (
				<p>Loading...</p>
			) : null}
		</>
	);
};
