import { LinkProps } from "next/link";
import { e } from "vitest/dist/index-c3f83a58";
import { PAGE_SIZE } from "../../lib/constants";
import { ActiveLink } from "../ActiveLink";

type QuestionsPaginationProps = Readonly<{
	current: number;
	total: number;
	getHref: (i: number) => LinkProps["href"];
}>;

export const QUESTIONS_PAGINATION_SEPARATOR = Symbol("QUESTIONS_PAGINATION_SEPARATOR");

export const getPages = ({
	first,
	last,
	current,
}: {
	first: number;
	last: number;
	current: number;
}): ReadonlyArray<number | typeof QUESTIONS_PAGINATION_SEPARATOR> => {
	if (first === last) {
		return [1];
	}

	const previous = current - (1 + Math.max(0, current - (last - 2)));
	const next = current + (1 + Math.max(0, 3 - current));
	const firstMiddle = Math.max(first + 1, previous);
	const lastMiddle = Math.min(last - 1, next);
	const middle = Array.from({ length: lastMiddle - firstMiddle + 1 }, (_, i) => firstMiddle + i);

	return [
		first,
		firstMiddle === first + 1 ? undefined : QUESTIONS_PAGINATION_SEPARATOR,
		...middle,
		lastMiddle === last - 1 ? undefined : QUESTIONS_PAGINATION_SEPARATOR,
		last,
	].filter((el): el is number | typeof QUESTIONS_PAGINATION_SEPARATOR => el !== undefined);
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
				{pages.map((page, idx) =>
					page === QUESTIONS_PAGINATION_SEPARATOR ? (
						<li key={`${page.toString()}_${idx}`} aria-hidden="true">
							<span className="-mx-2 flex h-7 w-7 cursor-default items-center justify-center text-primary after:content-['…'] dark:text-white"></span>
						</li>
					) : (
						<li key={page}>
							<ActiveLink
								href={getHref(page)}
								className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-primary text-primary transition-colors duration-300 hover:bg-violet-100 dark:text-white dark:hover:bg-violet-800"
								activeClassName="bg-primary text-white hover:bg-primary"
								aria-label={`Strona ${page}${
									current - 1 === page ? ", poprzednia" : current + 1 === page ? ", kolejna" : ""
								}`}
								activeAttributes={{
									"aria-current": "page",
									"aria-label": `Strona ${page}, bieżąca`,
								}}
								mergeQuery
							>
								{page}
							</ActiveLink>
						</li>
					),
				)}
			</ul>
		</nav>
	);
};
