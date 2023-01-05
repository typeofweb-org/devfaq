import { QuestionsSidebarSection } from "../QuestionsSidebarSection";
import AddIcon from "../../../../public/icons/add-icon.svg";
import { technologies } from "../../../lib/technologies";
import { Technology, TechnologyLink } from "./Technology";

export const TechnologyFilter = () => {
	return (
		<QuestionsSidebarSection title="Wybierz technologię">
			<ul className="flex justify-between gap-x-4 overflow-x-auto px-4 pb-4 sm:flex-wrap sm:gap-x-0 sm:gap-y-5 sm:overflow-x-visible sm:p-0 small-filters:gap-y-2">
				{technologies.map((technology) => (
					<li key={technology} className="pt-1">
						<Technology technology={technology} />
					</li>
				))}
				<li className="pt-1">
					<TechnologyLink
						href="https://github.com/typeofweb/devfaq/issues/new?title=[NOWA%20TECHNOLOGIA]:"
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
