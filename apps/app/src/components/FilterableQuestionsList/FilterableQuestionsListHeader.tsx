import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { useDevFAQRouter } from "../../hooks/useDevFAQRouter";
import { levels } from "../../lib/level";
import { Order, OrderBy, sortByLabels } from "../../lib/order";
import { QuestionStatus, statuses } from "../../lib/question";
import { technologies, technologiesLabels, Technology } from "../../lib/technologies";
import { Level } from "../QuestionItem/QuestionLevel";
import { Select } from "../Select/Select";
import { SelectLabel } from "../SelectLabel";
import { SortBySelect } from "../SortBySelect";

type FilterableQuestionsListHeaderProps = Readonly<{
	status?: QuestionStatus;
	technology?: Technology | null;
	levels?: Level[] | null;
	order?: Order;
	orderBy?: OrderBy;
}>;

export const FilterableQuestionsListHeader = ({
	status,
	technology,
	levels: selectedLevels,
	order,
	orderBy,
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
			{order && orderBy && (
				<SortBySelect
					order={order}
					orderBy={orderBy}
					onChange={handleSelectChange("sortBy")}
					sortByLabels={sortByLabels}
				/>
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
