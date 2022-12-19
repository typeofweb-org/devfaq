type ActionProps = Readonly<{
	icon: JSX.Element;
	disabled?: boolean;
	onClick: () => void;
}>;

export const Action = ({ icon, disabled, onClick }: ActionProps) => (
	<button
		type="button"
		className="flex h-7 w-7 items-center justify-center rounded-sm border border-transparent bg-[#f0f0f0] fill-[#737373] p-1 hover:border-neutral-400 disabled:hover:border-transparent"
		onClick={onClick}
		disabled={disabled}
	>
		{icon}
	</button>
);
