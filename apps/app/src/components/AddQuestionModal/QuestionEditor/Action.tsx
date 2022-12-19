type ActionProps = Readonly<{
	icon: JSX.Element;
	disabled?: boolean;
	onClick: () => void;
}>;

export const Action = ({ icon, disabled, onClick }: ActionProps) => (
	<button
		type="button"
		className="flex h-7 w-7 items-center justify-center rounded-[0.188rem] border border-transparent bg-stone-100 fill-neutral-500 p-1 hover:border-neutral-400 hover:bg-violet-50 disabled:hover:border-transparent disabled:hover:bg-stone-100 dark:bg-transparent dark:fill-neutral-300 dark:hover:bg-violet-900 disabled:hover:dark:bg-transparent"
		onClick={onClick}
		disabled={disabled}
	>
		{icon}
	</button>
);
