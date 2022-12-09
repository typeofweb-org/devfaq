import { ReactNode } from "react";

type MobileActionButtonProps = Readonly<{
	children: ReactNode;
	"aria-label": string;
	onClick: () => void;
}>;

export const MobileActionButton = (props: MobileActionButtonProps) => (
	<button
		className="flex h-11 w-11 appearance-none items-center justify-center rounded-full bg-primary shadow-md shadow-neutral-600 dark:shadow-neutral-900"
		{...props}
	/>
);
