import { twMerge } from "tailwind-merge";

type LoaderType = "spinner" | "article";

export const Loading = ({
	label,
	type = "spinner",
	withTechnology = false,
	withFilters = false,
	className,
}: {
	label: string;
	withTechnology?: boolean;
	type?: LoaderType;
	withFilters?: boolean;
	className?: string;
}) => {
	if (type === "article") {
		return (
			<>
				{withFilters && (
					<div className="flex animate-pulse flex-wrap items-baseline justify-between gap-3 text-neutral-500 dark:text-neutral-400">
						<span className="h-8 w-28 bg-neutral-100 dark:bg-neutral-700 md:gap-3"></span>
						<div className="flex flex-wrap items-baseline gap-1.5 md:gap-3">
							<span className="h-8 w-28 bg-neutral-100 dark:bg-neutral-700 md:gap-3"></span>
							<span className="hidden h-8 w-52 bg-neutral-100 dark:bg-neutral-700 md:flex md:gap-3"></span>
						</div>
					</div>
				)}
				<ul className="flex w-full list-none flex-col gap-5" role="status" aria-label={label}>
					{[...Array(10).keys()].map((i) => (
						<li key={i}>
							<article
								className={twMerge(
									`flex animate-pulse bg-white p-3 text-sm text-neutral-500 shadow-md dark:bg-white-dark dark:text-neutral-200 md:p-5`,
								)}
								style={{ animationDelay: `${i * 0.25}s` }}
							>
								<div className="mr-3 flex flex-col justify-start gap-1.5">
									<span className="block h-8 w-20 rounded-md bg-neutral-100 dark:bg-neutral-700"></span>
								</div>
								<div className="question-content flex max-w-full grow flex-col gap-1.5 px-2">
									<span className="block h-3.5 w-full bg-neutral-100 dark:bg-neutral-700"></span>
									<span className="block h-3.5 w-full bg-neutral-100 dark:bg-neutral-700"></span>
									<span className="block h-3.5 w-full bg-neutral-100 dark:bg-neutral-700"></span>
									<span className="block h-3.5 w-full bg-neutral-100 dark:bg-neutral-700"></span>
									<span className="block h-3.5 w-full bg-neutral-100 dark:bg-neutral-700"></span>
									<span className="block h-3.5 w-full bg-neutral-100 dark:bg-neutral-700"></span>
									<span className="block h-3.5 w-full bg-neutral-100 dark:bg-neutral-700"></span>
								</div>
								<div className="flex min-w-max flex-col items-center md:ml-4 md:items-end">
									<div className="flex flex-col items-center">
										{withTechnology && (
											<div className="mb-3 flex flex-col items-center self-center">
												<span className="mb-1 h-3.5 w-10 bg-neutral-100 dark:bg-neutral-700"></span>
												<div className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-700"></div>
											</div>
										)}
										<span className="h-8 min-w-[64px] rounded-full bg-neutral-100 dark:bg-neutral-700 md:min-w-[80px]"></span>
									</div>
									<div className="mt-3">
										<div className="block h-3 w-12 bg-neutral-100 dark:bg-neutral-700 md:w-20"></div>
									</div>
								</div>
							</article>
						</li>
					))}
				</ul>
			</>
		);
	}

	return (
		<div
			className={twMerge(`mt-8 flex items-center justify-center`, className)}
			aria-label={label}
			role="status"
		>
			<div className="h-12 w-12 animate-loader border-4 border-primary dark:border-neutral-200">
				<div className="w-full animate-loader-inner bg-primary dark:bg-neutral-100" />
			</div>
		</div>
	);
};
