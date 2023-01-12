import { useRouter } from "next/navigation";
import { ChangeEvent, ReactNode } from "react";
import { useDevFAQRouter } from "../../hooks/useDevFAQRouter";
import { levels } from "../../lib/level";
import { QuestionStatus, statuses } from "../../lib/question";
import { technologies, technologiesLabels, Technology } from "../../lib/technologies";
import { Level } from "../QuestionItem/QuestionLevel";
import { Select } from "../Select/Select";

type FilterableQuestionsListHeaderProps = Readonly<{
	status?: QuestionStatus;
	technology?: Technology | null;
	levels?: Level[] | null;
}>;

const SelectLabel = ({ children }: { readonly children: ReactNode }) => (
	<label className="flex flex-wrap items-baseline gap-1.5 md:gap-3">{children}</label>
);

export const FilterableQuestionsListHeader = ({
	status,
	technology,
	levels: selectedLevels,
}: FilterableQuestionsListHeaderProps) => {
	const { mergeQueryParams } = useDevFAQRouter();
	const router = useRouter();

	const handleSelectChange = (param: string) => (event: ChangeEvent<HTMLSelectElement>) => {
		event.preventDefault();
		mergeQueryParams({ [param]: event.target.value });
	};

	return (
		<header className="flex w-full flex-wrap items-center justify-between gap-6 text-neutral-400">
			{technology !== undefined && (
				<SelectLabel>
					Technologia:
					<Select
						variant="default"
						value={technology || ""}
						onChange={handleSelectChange("technology")}
					>
						<option value="">Wszystkie</option>
						{technologies.map((technology) => (
							<option key={technology} value={technology}>
								{technologiesLabels[technology]}
							</option>
						))}
					</Select>
				</SelectLabel>
			)}
			{levels !== undefined && (
				<SelectLabel>
					Poziom:
					<Select
						variant="default"
						value={selectedLevels?.[0] || ""}
						onChange={handleSelectChange("level")}
					>
						<option value="">Wszystkie</option>
						{levels.map((level) => (
							<option key={level} value={level}>
								{level}
							</option>
						))}
					</Select>
				</SelectLabel>
			)}
			{status !== undefined && (
				<SelectLabel>
					Status:
					<Select
						variant="default"
						value={status}
						onChange={({ target }) => router.push(`/admin/${target.value}/1`)}
					>
						{statuses.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</Select>
				</SelectLabel>
			)}
		</header>
	);
};
