export const SkipToTheContent = () => {
	// @todo replace with `Link` when https://github.com/vercel/next.js/issues/44295 is fixed
	return (
		<a
			href={`#main-content`}
			className="fixed -top-[100%] z-50 m-4 border-white bg-violet-900 p-4 px-8 text-white focus:top-0 focus:border-2 focus:border-dashed"
		>
			Przejdź do treści
		</a>
	);
};
