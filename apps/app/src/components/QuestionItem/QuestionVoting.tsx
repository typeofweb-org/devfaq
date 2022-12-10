import { twMerge } from "tailwind-merge";
import { pluralize } from "../../utils/intl";

type QuestionVotingProps = Readonly<{
	votes: number;
	voted: boolean;
}>;

const votesPluralize = pluralize("głos", "głosy", "głosów");

export const QuestionVoting = ({ votes, voted }: QuestionVotingProps) => {
	return (
		<button
			className={twMerge(
				"mr-4 flex h-fit items-center gap-x-1.5 text-neutral-200 transition-colors",
				voted && "text-violet-700 dark:text-violet-300",
			)}
			type="button"
			aria-label={`To pytanie ma ${votes} ${votesPluralize(votes)}. Kliknij, aby ${
				voted ? "usunąć" : "dodać"
			} swój głos.`}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				version="1.1"
				width="15"
				height="13"
				fill="currentColor"
				className={twMerge("transition-transform duration-300", voted ? "rotate-180" : "rotate-0")}
			>
				<polygon points="7.5,0 15,13 0,13" />
			</svg>
			{votes}
		</button>
	);
};
