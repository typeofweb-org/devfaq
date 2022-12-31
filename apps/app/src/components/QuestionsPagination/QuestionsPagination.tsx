import { LinkProps } from "next/link";
import { PAGE_SIZE } from "../../lib/constants";
import { ActiveLink } from "../ActiveLink";

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
	if (first === last) {
		return [1];
	}

	const previous = current - (1 + Math.max(0, current - (last - 2)));
	const next = current + (1 + Math.max(0, 3 - current));
	const firstMiddle = Math.max(first + 1, previous);
	const lastMiddle = Math.min(last - 1, next);
	const middle = Array.from({ length: lastMiddle - firstMiddle + 1 }, (_, i) => firstMiddle + i);

	return [first, ...middle, last];
};

export const QuestionsPagination = ({ current, total, getHref }: QuestionsPaginationProps) => {
	const pages = getPages({
		first: 1,
		current,
		last: Math.ceil(total / PAGE_SIZE),
	});

	return (
		<nav aria-label="Paginacja" role="navigation">
			<ul className="flex justify-center gap-x-3">
				{pages.map((i) => (
					<li key={i}>
						<ActiveLink
							href={getHref(i)}
							className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-primary text-primary transition-colors duration-300 hover:bg-violet-100 dark:text-white dark:hover:bg-violet-800"
							activeClassName="bg-primary text-white hover:bg-primary"
							aria-label={`Strona ${i}${
								current - 1 === i ? ", poprzednia" : current + 1 === i ? ", kolejna" : ""
							}`}
							activeAttributes={{
								"aria-current": "page",
								"aria-label": `Strona ${i}, bieżąca`,
							}}
							mergeQuery
						>
							{i}
						</ActiveLink>
					</li>
				))}
			</ul>
		</nav>
	);
};
