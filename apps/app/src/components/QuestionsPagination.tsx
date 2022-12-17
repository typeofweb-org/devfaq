import { PAGE_SIZE } from "../lib/constants";
import { ActiveLink } from "./ActiveLink";

type QuestionsPaginationProps = Readonly<{
	technology: string;
	total: number;
}>;

export const QuestionsPagination = ({ technology, total }: QuestionsPaginationProps) => {
	const pages = Math.ceil(total / PAGE_SIZE);

	return (
		<div className="flex justify-center gap-x-3">
			{Array.from({ length: pages }).map((_, i) => (
				<ActiveLink
					key={i}
					href={`/questions/${technology}/${i + 1}`}
					className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-primary text-primary transition-colors duration-300 hover:bg-violet-100 dark:text-white dark:hover:bg-violet-800"
					activeClassName="bg-primary text-white hover:bg-primary"
					mergeQuery
				>
					{i + 1}
				</ActiveLink>
			))}
		</div>
	);
};
