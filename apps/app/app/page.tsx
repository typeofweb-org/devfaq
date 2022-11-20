import { Button } from "ui";

export default function Page() {
	return (
		<div>
			Siema <Button />
			<ul style={{ fontFamily: "monospace" }}>
				<li>NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL}</li>
				<li>NEXT_PUBLIC_APP_URL: {process.env.NEXT_PUBLIC_APP_URL}</li>
			</ul>
		</div>
	);
}
