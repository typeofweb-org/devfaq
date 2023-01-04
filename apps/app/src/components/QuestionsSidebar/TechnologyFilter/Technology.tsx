import { ReactElement } from "react";
import { twMerge } from "tailwind-merge";
import { technologiesLabels, Technology as TechnologyType } from "../../../lib/technologies";
import { ActiveLink } from "../../ActiveLink";
import { TechnologyIcon } from "../../TechnologyIcon";

type TechnologyProps = Readonly<{
	technology: TechnologyType;
}>;

export const Technology = ({ technology }: TechnologyProps) => (
	<TechnologyLink
		label={technologiesLabels[technology]}
		title={`Wyświetl pytania z kategorii ${technologiesLabels[technology]}`}
		href={`/questions/${technology}/1`}
		activeHref={`/questions/${technology}`}
		icon={<TechnologyIcon technology={technology} />}
	/>
);

type TechnologyLinkProps = Readonly<{
	href: string;
	title: string;
	label: string;
	icon: ReactElement;
	transparent?: boolean;
	activeHref?: string;
	target?: string;
}>;

export const TechnologyLink = ({
	href,
	title,
	label,
	transparent,
	activeHref,
	icon,
	target,
}: TechnologyLinkProps) => {
	return (
		<ActiveLink
			className={twMerge(
				`flex min-h-[85px] min-w-[85px] cursor-pointer flex-col items-center justify-center rounded-lg transition hover:bg-violet-50 hover:dark:bg-violet-900 small-filters:h-14 small-filters:min-h-[unset] small-filters:w-14 small-filters:min-w-[unset] small-filters:[&>svg]:h-7 small-filters:[&>svg]:w-7`,
				transparent
					? `hover:shadow-[0px_1px_4px] hover:shadow-neutral-400 hover:dark:bg-white-dark hover:dark:shadow-neutral-900`
					: `bg-white shadow-[0px_1px_4px] shadow-neutral-400 dark:bg-white-dark dark:shadow-neutral-900`,
			)}
			activeClassName="border border-primary bg-violet-50 dark:bg-violet-900"
			title={title}
			href={href}
			activeHref={activeHref}
			target={target}
			mergeQuery
		>
			<span className="text-sm text-neutral-600 dark:text-neutral-200 small-filters:text-xs">
				{label}
			</span>
			{icon}
		</ActiveLink>
	);
};
