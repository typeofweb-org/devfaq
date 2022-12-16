import Link from "next/link";
import { ActiveLink } from "../../../components/ActiveLink";

export default function Page() {
	return (
		<div>
			<ActiveLink
				href={{
					pathname: "test",
				}}
				activeClassName=""
			>
				test
			</ActiveLink>
		</div>
	);
}
