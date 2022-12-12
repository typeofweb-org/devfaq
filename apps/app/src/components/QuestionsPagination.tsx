import { PAGE_SIZE } from "../lib/constants";
import { ActiveLink } from "./ActiveLink";

const PageItem = ({ page }: { readonly page: number }) => {
	return (
		<ActiveLink
			href={`/questions/js/${page}`}
			className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-primary text-primary transition-colors duration-300 hover:bg-violet-100 dark:text-white dark:hover:bg-violet-800"
			activeClassName="bg-primary text-white"
		>
			{page}
		</ActiveLink>
	);
};

export const QuestionsPagination = ({ total }: { readonly total: number }) => {
	const pages = Math.ceil(total / PAGE_SIZE);

	return (
		<div className="flex justify-center gap-x-3">
			{Array.from({ length: pages }).map((_, i) => (
				<PageItem key={i} page={i + 1} />
			))}
		</div>
	);
};
