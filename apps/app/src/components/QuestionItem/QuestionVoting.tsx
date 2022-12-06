export const QuestionVoting = ({ votes }: { readonly votes: number }) => (
	<button className="mr-4 flex gap-x-1.5 text-base leading-4 text-gray-300">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			version="1.1"
			width="15"
			height="13"
			fill="currentColor"
		>
			<polygon points="7.5,0 15,13 0,13" />
		</svg>
		{votes}
	</button>
);
