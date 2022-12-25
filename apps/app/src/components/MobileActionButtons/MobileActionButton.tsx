import { ReactNode } from "react";
import { Button } from "../Button/Button";

type MobileActionButtonProps = Readonly<{
	children: ReactNode;
	"aria-label": string;
	onClick: () => void;
}>;

export const MobileActionButton = (props: MobileActionButtonProps) => (
	<Button
		variant="brandingInverse"
		{...props}
		className="flex h-11 w-11 items-center justify-center rounded-full border-none p-0 shadow-md shadow-neutral-600 dark:shadow-neutral-900"
	/>
);
