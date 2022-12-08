import { twMerge } from "tailwind-merge";
import { QuestionsSidebarSection } from "../QuestionsSidebarSection";
import HTMLLogo from "../../../../public/icons/html5-logo.svg";
import CSSLogo from "../../../../public/icons/css3-logo.svg";
import JavaScriptLogo from "../../../../public/icons/javascript-logo.svg";
import AngularLoro from "../../../../public/icons/angularjs-logo.svg";
import ReactLogo from "../../../../public/icons/reactjs-logo.svg";
import GitLogo from "../../../../public/icons/git-logo.svg";
import OtherLogo from "../../../../public/icons/other-logo.svg";

import { Technology } from "./Technology";

export const TechnologyFilter = () => {
	return (
		<QuestionsSidebarSection title="Wybierz technologię">
			<div
				className={twMerge(
					"flex gap-5 overflow-x-auto p-1 pb-4",
					"small-filters:flex-wrap small-filters:gap-4 small-filters:overflow-x-visible",
					"sm:flex-wrap sm:gap-7 sm:overflow-x-visible sm:p-0",
				)}
			>
				<Technology title="HTML5" icon={<HTMLLogo />} isActive />
				<Technology title="CSS3" icon={<CSSLogo />} />
				<Technology title="JS" icon={<JavaScriptLogo />} />
				<Technology title="Angular" icon={<AngularLoro />} />
				<Technology title="React" icon={<ReactLogo />} />
				<Technology title="Git" icon={<GitLogo />} />
				<Technology title="Inne" icon={<OtherLogo />} />
			</div>
		</QuestionsSidebarSection>
	);
};
