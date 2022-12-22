export default function Loading() {
	return (
		<div className="mt-8 flex items-center justify-center" aria-label="ładowanie pytań">
			<div className="h-12 w-12 animate-loader border-4 border-primary">
				<div className="w-full animate-loader-inner bg-primary" />
			</div>
		</div>
	);
}
