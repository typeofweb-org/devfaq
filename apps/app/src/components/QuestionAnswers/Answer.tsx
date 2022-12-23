import { QuestionAnswer } from "../../types";
import { formatDate } from "../../utils/intl";
import { GitHubAvatar } from "../GitHubAvatar";
import { MarkDownContent } from "../MarkDownContent";

type AnswerProps = Readonly<{
	answer: QuestionAnswer;
}>;

export const Answer = ({ answer: { mdxContent, createdBy, createdAt } }: AnswerProps) => {
	const creationDate = new Date(createdAt);

	return (
		<div className="bg-white p-4 text-neutral-600 shadow-md">
			<div className="flex">
				<GitHubAvatar user={createdBy} width={42} height={42} className="rounded-full" />
				<div className="ml-3.5 flex flex-col items-end justify-center leading-4">
					<p className="font-bold text-black">
						{createdBy.firstName} {createdBy.lastName}
					</p>
					<time
						dateTime={creationDate.toISOString()}
						aria-label={`Odpowiedź dodano ${formatDate(creationDate, "long")}`}
						title={`Odpowiedź dodano ${formatDate(creationDate, "long")}`}
						className="text-sm"
					>
						{formatDate(creationDate, "short")}
					</time>
				</div>
			</div>
			<div className="mt-4 text-justify">
				<MarkDownContent source={mdxContent} />
			</div>
			<div className="mt-4 text-sm italic text-neutral-500">
				Źródła:
				<ol className="list-decimal px-3 underline">
					<li>
						<a
							href="https://beta.reactjs.org/apis/react/useContext"
							target="_blank"
							rel="noreferrer"
						>
							https://beta.reactjs.org/apis/react/useContext
						</a>
					</li>
				</ol>
			</div>
		</div>
	);
};
