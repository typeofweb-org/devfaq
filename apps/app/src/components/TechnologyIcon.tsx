/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ComponentType, HTMLAttributes } from "react";
import { Technology } from "../lib/technologies";
import HTMLLogo from "../../public/icons/html5-logo.svg";
import CSSLogo from "../../public/icons/css3-logo.svg";
import JavaScriptLogo from "../../public/icons/javascript-logo.svg";
import AngularLogo from "../../public/icons/angularjs-logo.svg";
import ReactLogo from "../../public/icons/reactjs-logo.svg";
import GitLogo from "../../public/icons/git-logo.svg";
import OtherLogo from "../../public/icons/other-logo.svg";

const icons: Record<Technology, ComponentType<HTMLAttributes<HTMLElement>>> = {
	html: HTMLLogo,
	css: CSSLogo,
	js: JavaScriptLogo,
	angular: AngularLogo,
	react: ReactLogo,
	git: GitLogo,
	other: OtherLogo,
};

type TechnologyIconProps = Readonly<{
	technology: Technology;
	className?: string;
}>;

export const TechnologyIcon = ({ technology, className }: TechnologyIconProps) => {
	const Icon = icons[technology];

	return <Icon className={className} />;
};
