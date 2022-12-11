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

export const TechnologyFilter = () => {
	return (
		<QuestionsSidebarSection title="Wybierz technologię">
			<div className="flex justify-between gap-x-4 overflow-x-auto px-4 pb-4 sm:flex-wrap sm:gap-x-0 sm:gap-y-7 sm:overflow-x-visible sm:p-0 small-filters:gap-y-4">
				<Technology title="HTML5" icon={<HTMLLogo />} isActive />
				<Technology title="CSS3" icon={<CSSLogo />} />
				<Technology title="JS" icon={<JavaScriptLogo />} />
				<Technology title="Angular" icon={<AngularLogo />} />
				<Technology title="React" icon={<ReactLogo />} />
				<Technology title="Git" icon={<GitLogo />} />
				<Technology title="Inne" icon={<OtherLogo />} />
			</div>
		</QuestionsSidebarSection>
	);
};
