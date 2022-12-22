import { LinkProps } from "next/link";
import { PAGE_SIZE } from "../lib/constants";
import { ActiveLink } from "./ActiveLink";

type QuestionsPaginationProps = Readonly<{
	current: number;
	total: number;
	getHref: (i: number) => LinkProps["href"];
}>;

export const getPages = ({
	first,
	last,
	current,
}: {
	first: number;
	last: number;
	current: number;
}) => {
	const previous = current - (1 + Math.max(0, current - (last - 2)));
	const next = current + (1 + Math.max(0, 3 - current));
	const pages = [first];

	for (let i = Math.max(first + 1, previous); i <= Math.min(last - 1, next); i++) {
		pages.push(i);
	}

	return [...pages, last];
};

export const QuestionsPagination = ({ current, total, getHref }: QuestionsPaginationProps) => {
	const pages = getPages({
		first: 1,
		current,
		last: Math.ceil(total / PAGE_SIZE),
	});

	return (
		<nav aria-label="pagination" className="flex justify-center gap-x-3">
			{pages.map((i) => (
				<ActiveLink
					key={i}
					href={getHref(i)}
					className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-primary text-primary transition-colors duration-300 hover:bg-violet-100 dark:text-white dark:hover:bg-violet-800"
					activeClassName="bg-primary text-white hover:bg-primary"
					activeAttributes={{
						"aria-current": "page",
					}}
					mergeQuery
				>
					<span className="sr-only">Strona</span> {i}
				</ActiveLink>
			))}
		</nav>
	);
};
