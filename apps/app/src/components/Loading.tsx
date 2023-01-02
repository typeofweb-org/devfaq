import { twMerge } from "tailwind-merge";

export const Loading = ({ label, className }: { label: string; className?: string }) => {
	return (
		<div className={twMerge(`mt-8 flex items-center justify-center`, className)} aria-label={label}>
			<div className="h-12 w-12 animate-loader border-4 border-primary dark:border-neutral-200">
				<div className="w-full animate-loader-inner bg-primary dark:bg-neutral-200" />
			</div>
		</div>
	);
};
