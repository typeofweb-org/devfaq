import { twMerge } from "tailwind-merge";
import { QuestionsSidebarSection } from "../QuestionsSidebarSection";
import HTMLLogo from "../../../../public/icons/html5-logo.svg";
import CSSLogo from "../../../../public/icons/css3-logo.svg";
import JavaScriptLogo from "../../../../public/icons/javascript-logo.svg";
import AngularLogo from "../../../../public/icons/angularjs-logo.svg";
import ReactLogo from "../../../../public/icons/reactjs-logo.svg";
import GitLogo from "../../../../public/icons/git-logo.svg";
import OtherLogo from "../../../../public/icons/other-logo.svg";

import { Technology } from "./Technology";

const technologyFilters = [
	{ href: "html", title: "HTML", icon: <HTMLLogo /> },
	{ href: "css", title: "CSS", icon: <CSSLogo /> },
	{ href: "js", title: "JS", icon: <JavaScriptLogo /> },
	{ href: "angular", title: "Angular", icon: <AngularLogo /> },
	{ href: "react", title: "React", icon: <ReactLogo /> },
	{ href: "git", title: "Git", icon: <GitLogo /> },
	{ href: "other", title: "Inne", icon: <OtherLogo /> },
] as const;

export const TechnologyFilter = () => {
	return (
		<QuestionsSidebarSection title="Wybierz technologię">
			<div className="flex justify-between gap-x-4 overflow-x-auto px-4 pb-4 sm:flex-wrap sm:gap-x-0 sm:gap-y-7 sm:overflow-x-visible sm:p-0 small-filters:gap-y-4">
				{technologyFilters.map((tech) => (
					<Technology key={tech.href} {...tech} />
				))}
			</div>
		</QuestionsSidebarSection>
	);
};
