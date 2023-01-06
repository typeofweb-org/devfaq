import { QuestionAnswer } from "../../types";
import { formatDate } from "../../utils/intl";
import { Box } from "../Box";
import { GitHubAvatar } from "../GitHubAvatar";
import { MarkdownContent } from "../MarkdownContent";

type AnswerProps = Readonly<{
	answer: QuestionAnswer;
}>;

export const Answer = ({ answer: { mdxContent, createdBy, createdAt, sources } }: AnswerProps) => {
	const creationDate = new Date(createdAt);

	return (
		<Box as="article" className="flex-col">
			<header className="flex gap-x-3.5">
				<GitHubAvatar user={createdBy} width={40} height={40} className="rounded-full" />
				<div
					className="flex flex-col items-end justify-center leading-4"
					title="Autor(-ka) pytania"
				>
					<span className="font-bold text-black dark:text-neutral-200">
						<span className="sr-only">Autor(-ka) pytania: </span>
						{createdBy.firstName} {createdBy.lastName}
					</span>
					<time
						dateTime={creationDate.toISOString()}
						aria-label={`Odpowiedź dodano ${formatDate(creationDate, "long")}`}
						title={`Odpowiedź dodano ${formatDate(creationDate, "long")}`}
						className="text-sm text-neutral-600 dark:text-neutral-400"
					>
						{formatDate(creationDate, "short")}
					</time>
				</div>
			</header>
			<div className="-mx-2 mt-4">
				<MarkdownContent source={mdxContent} />
			</div>
			{sources.length > 0 && (
				<div className="mt-4 text-sm italic text-neutral-500 dark:text-neutral-400">
					Źródła:
					<ol className="list-decimal px-3 underline">
						{sources.map((source, i) => (
							<li key={i}>
								<a
									href={source}
									target="_blank"
									rel="noreferrer"
									className="block w-full overflow-hidden text-ellipsis"
								>
									{source}
								</a>
							</li>
						))}
					</ol>
				</div>
			)}
		</Box>
	);
};
