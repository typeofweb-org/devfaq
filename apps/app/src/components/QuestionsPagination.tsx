import { LinkProps } from "next/link";
import { PAGE_SIZE } from "../lib/constants";
import { ActiveLink } from "./ActiveLink";

type QuestionsPaginationProps = Readonly<{
	total: number;
	getHref: (i: number) => LinkProps["href"];
}>;

export const QuestionsPagination = ({ total, getHref }: QuestionsPaginationProps) => {
	const pages = Math.ceil(total / PAGE_SIZE);

	return (
		<nav aria-label="pagination" className="flex justify-center gap-x-3">
			{Array.from({ length: pages }).map((_, i) => (
				<ActiveLink
					key={i}
					href={getHref(i + 1)}
					className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-primary text-primary transition-colors duration-300 hover:bg-violet-100 dark:text-white dark:hover:bg-violet-800"
					activeClassName="bg-primary text-white hover:bg-primary"
					activeAttributes={{
						"aria-current": "page",
					}}
					mergeQuery
				>
					<span className="sr-only">Strona</span> {i + 1}
				</ActiveLink>
			))}
		</nav>
	);
};
