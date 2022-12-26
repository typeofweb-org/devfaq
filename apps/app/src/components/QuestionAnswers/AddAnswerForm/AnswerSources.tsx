"use client";

import { ChangeEvent } from "react";
import { Button } from "../../Button/Button";
import BinIcon from "../../../../public/icons/bin.svg";

type AnswerSourcesProps = Readonly<{
	sources: string[];
	onChange: (values: string[]) => void;
}>;

export const AnswerSources = ({ sources, onChange }: AnswerSourcesProps) => {
	const handleInputChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;

		if (value.length > 2048) {
			return;
		}

		const newSources = [...sources];
		newSources[index] = value;

		onChange(newSources);
	};

	const handleDeleteIconClick = (index: number) => () => {
		const newSources = sources.filter((_, i) => i !== index);
		onChange(newSources);
	};

	const handleAddButtonClick = () => {
		if (sources.length && !sources.at(-1)) {
			return;
		}

		onChange([...sources, ""]);
	};

	return (
		<div className="mt-3">
			<p className="text-sm text-neutral-500 dark:text-neutral-300">
				Jeżeli podczas udzielania odpowiedzi korzystałeś z dodatkowych źródeł, lub chcesz
				podlinkować dodatkowe materiały do komentarza, dodaj je do swojej odpowiedzi:
			</p>
			<div className="mt-1.5 flex flex-col gap-y-2">
				{sources.map((source, i) => (
					<div className="flex gap-x-1.5" key={i}>
						<input
							type="text"
							placeholder="Link do źródła"
							value={source}
							onChange={handleInputChange(i)}
							className="flex-1 rounded-md border border-primary bg-transparent p-1.5 text-primary focus:outline-0 dark:border-white dark:text-neutral-200"
						/>
						<div
							className="w-6 cursor-pointer fill-primary dark:fill-purple-300"
							onClick={handleDeleteIconClick(i)}
							aria-label="usuń źródło"
						>
							<BinIcon className="h-full w-full" viewBox="0 0 24 24" />
						</div>
					</div>
				))}
			</div>
			<Button
				type="button"
				variant="branding"
				onClick={handleAddButtonClick}
				className="my-3 w-full"
			>
				Dodaj źródło
			</Button>
		</div>
	);
};
