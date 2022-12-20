import { ReactNode } from "react";
import { PAGE_SIZE } from "../../../../../lib/constants";
import { technologies, Technology } from "../../../../../lib/technologies";
import { getAllQuestions } from "../../../../../services/questions.service";

export default function QuestionsTechnologyLayout({ children }: { children: ReactNode }) {
	return children;
}

export async function generateStaticParams() {
	const params = await Promise.all(
		technologies.map(async (technology) => {
			const response = await getAllQuestions({ category: technology, limit: 0 });
			return Array.from({ length: Math.ceil(response.data.meta.total / PAGE_SIZE) }, (_, idx) => {
				return { technology, page: String(idx + 1) };
			});
		}),
	);
	return params.flat();
}
