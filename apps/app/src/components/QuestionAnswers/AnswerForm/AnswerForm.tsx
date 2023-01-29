"use client";

import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Button } from "../../Button/Button";
import { WysiwygEditor } from "../../WysiwygEditor/WysiwygEditor";
import { URL_REGEX } from "../../../lib/constants";
import { Error } from "../../Error";
import { AnswerSources } from "./AnswerSources";

interface SubmitData {
	readonly content: string;
	readonly sources: string[];
}

type AnswerFormProps = Readonly<{
	title: string;
	onSubmit: (data: SubmitData) => Promise<void>;
	initContent?: string;
	initSources?: string[];
	error?: boolean;
	children?: ReactNode;
}>;

export const AnswerForm = ({
	title,
	onSubmit,
	initContent,
	initSources,
	error,
	children,
}: AnswerFormProps) => {
	const router = useRouter();
	const [content, setContent] = useState(initContent || "");
	const [sources, setSources] = useState<string[]>(initSources || []);
	const [isError, setIsError] = useState(false);

	const disabled =
		content.trim().length === 0 || !sources.every((source) => URL_REGEX.test(source));

	const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		onSubmit({ content, sources })
			.then(() => {
				setContent("");
				setSources([]);
				router.refresh();
			})
			.catch(() => setIsError(true));
	};

	return (
		<>
			<h3 className="text-md font-bold dark:text-neutral-200">{title}</h3>
			<form onSubmit={handleFormSubmit}>
				<WysiwygEditor value={content} onChange={setContent} />
				<AnswerSources sources={sources} onChange={setSources} />
				<div className="flex flex-col gap-y-1">
					<Button
						type="submit"
						variant="brandingInverse"
						className="mt-6 w-full"
						disabled={disabled}
					>
						{title}
					</Button>
					{children}
				</div>
			</form>
			<Error visible={error || isError} className="mt-2" />
		</>
	);
};
