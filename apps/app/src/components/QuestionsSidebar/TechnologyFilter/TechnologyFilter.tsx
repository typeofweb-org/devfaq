import { twMerge } from "tailwind-merge";
import { QuestionsSidebarSection } from "../QuestionsSidebarSection";
import HTMLLogo from "../../../../public/icons/html5-logo.svg";
import CSSLogo from "../../../../public/icons/css3-logo.svg";
import JavaScriptLogo from "../../../../public/icons/javascript-logo.svg";
import AngularLogo from "../../../../public/icons/angularjs-logo.svg";
import ReactLogo from "../../../../public/icons/reactjs-logo.svg";
import GitLogo from "../../../../public/icons/git-logo.svg";
import OtherLogo from "../../../../public/icons/other-logo.svg";
import AddIcon from "../../../../public/icons/add-icon.svg";

import { Technology, TechnologyLink } from "./Technology";

const technologyFilters = [
	{ technology: "html", technologyTitle: "HTML", icon: <HTMLLogo /> },
	{ technology: "css", technologyTitle: "CSS", icon: <CSSLogo /> },
	{ technology: "js", technologyTitle: "JS", icon: <JavaScriptLogo /> },
	{ technology: "angular", technologyTitle: "Angular", icon: <AngularLogo /> },
	{ technology: "react", technologyTitle: "React", icon: <ReactLogo /> },
	{ technology: "git", technologyTitle: "Git", icon: <GitLogo /> },
	{ technology: "other", technologyTitle: "Inne", icon: <OtherLogo /> },
] as const;

export const TechnologyFilter = () => {
	return (
		<QuestionsSidebarSection title="Wybierz technologię">
			<ul className="flex justify-between gap-x-4 overflow-x-auto px-4 pb-4 sm:flex-wrap sm:gap-x-0 sm:gap-y-5 sm:overflow-x-visible sm:p-0 small-filters:gap-y-2">
				{technologyFilters.map((tech) => (
					<li key={tech.technology} className="pt-1">
						<Technology {...tech} />
					</li>
				))}
				<li className="pt-1">
					<TechnologyLink
						href="https://github.com/typeofweb/devfaq/issues/new"
						icon={<AddIcon className="text-green-700" />}
						title="Czegoś brakuje? Zasugeruj dodanie nowej technologii"
						label="Dodaj"
						target="_blank"
						transparent={true}
					/>
				</li>
			</ul>
		</QuestionsSidebarSection>
	);
};
