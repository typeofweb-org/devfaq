import { ReactNode } from "react";
import { Button } from "../Button/Button";

type MobileActionButtonProps = Readonly<{
	children: ReactNode;
	"aria-label": string;
	onClick: () => void;
}>;

export const MobileActionButton = (props: MobileActionButtonProps) => (
	<Button variant="mobileAction" {...props} />
);
