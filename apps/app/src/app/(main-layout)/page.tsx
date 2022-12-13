import Link from "next/link";

export default function Page() {
	return (
		<div className="m-2 p-2">
			Siema
			<div className="flex">
				<div className="h-24 w-24 bg-violet-50" />
				<div className="h-24 w-24 bg-violet-100" />
				<div className="h-24 w-24 bg-violet-200" />
				<div className="h-24 w-24 bg-violet-300" />
				<div className="h-24 w-24 bg-violet-400" />
				<div className="h-24 w-24 bg-violet-500" />
				<div className="h-24 w-24 bg-violet-600" />
				<div className="h-24 w-24 bg-violet-700" />
				<div className="h-24 w-24 bg-violet-800" />
				<div className="h-24 w-24 bg-violet-900" />
			</div>
			<div className="flex">
				<div className="h-24 w-24 bg-red-branding" />
				<div className="h-24 w-24 bg-red-branding-dark" />
				<div className="h-24 w-24 bg-yellow-branding" />
				<div className="h-24 w-24 bg-yellow-branding-dark" />
			</div>
			<div className="h-screen" />
			<ul className="font-mono">
				<li>Test</li>
				<li>NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL}</li>
				<li>NEXT_PUBLIC_APP_URL: {process.env.NEXT_PUBLIC_APP_URL}</li>
			</ul>
			<Link href="/foo">foo</Link>
		</div>
	);
}
