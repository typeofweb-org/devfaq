import { twMerge } from "tailwind-merge";
import { pluralize } from "../../utils/intl";

type QuestionVotingProps = Readonly<{
	votes: number;
	isVoted: boolean;
}>;

const votesPluralize = pluralize("głos", "głosy", "głosów");

export const QuestionVoting = ({ votes, isVoted }: QuestionVotingProps) => {
	return (
		<button
			className={twMerge(
				"mr-4 flex h-fit items-center gap-x-1.5 text-gray-300 transition-colors",
				isVoted && "text-primary",
			)}
			type="button"
			aria-label={`To pytanie ma ${votes} ${votesPluralize(votes)}. Kliknij, aby ${
				isVoted ? "usunąć" : "dodać"
			} swój głos.`}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				version="1.1"
				width="15"
				height="13"
				fill="currentColor"
				className={twMerge(
					"transition-transform duration-300",
					isVoted ? "rotate-180" : "rotate-0",
				)}
			>
				<polygon points="7.5,0 15,13 0,13" />
			</svg>
			{votes}
		</button>
	);
};
