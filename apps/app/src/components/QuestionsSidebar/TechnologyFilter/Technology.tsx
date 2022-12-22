import { ReactElement } from "react";
import { ActiveLink } from "../../ActiveLink";

type TechnologyProps = Readonly<{
	href: string;
	title: string;
	icon: ReactElement;
}>;

export const Technology = ({ href, title, icon }: TechnologyProps) => (
	<ActiveLink
		className="flex min-h-[85px] min-w-[85px] cursor-pointer flex-col items-center justify-center rounded-lg bg-white shadow-[0px_1px_4px] shadow-neutral-400 transition-colors hover:bg-violet-50 dark:bg-white-dark dark:shadow-neutral-900 hover:dark:bg-violet-900 small-filters:h-14 small-filters:min-h-[unset] small-filters:w-14 small-filters:min-w-[unset] small-filters:[&>svg]:h-7 small-filters:[&>svg]:w-7"
		activeClassName="border border-primary bg-violet-50 dark:bg-violet-900"
		title={title}
		href={`/questions/${href}/1`}
		activeHref={`/questions/${href}`}
		mergeQuery
	>
		<span className="text-sm text-neutral-600 dark:text-neutral-200 small-filters:text-xs">
			{title}
		</span>
		{icon}
	</ActiveLink>
);
