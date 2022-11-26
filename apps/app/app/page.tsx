import { Button } from "ui";

export default function Page() {
	return (
		<div className="m-2 p-2">
			Siema <Button />
			<ul className="font-mono">
				<li>Test</li>
				<li>NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL}</li>
				<li>NEXT_PUBLIC_APP_URL: {process.env.NEXT_PUBLIC_APP_URL}</li>
			</ul>
		</div>
	);
}
