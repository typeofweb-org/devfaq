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
import OGHTMLLogo from "../../public/icons/og/html5-logo.svg";
import OGCSSLogo from "../../public/icons/og/css3-logo.svg";
import OGJavaScriptLogo from "../../public/icons/og/javascript-logo.svg";
import OGAngularLogo from "../../public/icons/og/angularjs-logo.svg";
import OGReactLogo from "../../public/icons/og/reactjs-logo.svg";
import OGGitLogo from "../../public/icons/og/git-logo.svg";

const icons: Record<
	Technology,
	{
		normal: ComponentType<HTMLAttributes<HTMLElement>>;
		og?: ComponentType<HTMLAttributes<HTMLElement>>;
	}
> = {
	html: {
		normal: HTMLLogo,
		og: OGHTMLLogo,
	},
	css: {
		normal: CSSLogo,
		og: OGCSSLogo,
	},
	js: {
		normal: JavaScriptLogo,
		og: OGJavaScriptLogo,
	},
	angular: {
		normal: AngularLogo,
		og: OGAngularLogo,
	},
	react: {
		normal: ReactLogo,
		og: OGReactLogo,
	},
	git: {
		normal: GitLogo,
		og: OGGitLogo,
	},
	other: {
		normal: OtherLogo,
	},
};

type TechnologyIconProps = Readonly<{
	technology: Technology;
	isOG?: boolean;
	className?: string;
	tw?: string;
}>;

export const TechnologyIcon = ({ technology, isOG, className, tw }: TechnologyIconProps) => {
	const Icon = icons[technology][isOG ? "og" : "normal"];

	if (!Icon) {
		return null;
	}

	return <Icon className={className} tw={tw} />;
};
