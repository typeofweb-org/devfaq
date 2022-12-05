import Link from "next/link";
import Logo from "../../../public/devfaq-logo.svg";
import { Container } from "../Container";
import { ActiveLink } from "../ActiveLink";
import { HeaderNavigation } from "./HeaderNavigation";

const ACTIVE_CLASS_NAME = "border-b border-white";

export const Header = () => (
	<div className="bg-violet-600">
		<Container
			as="header"
			className="flex h-16 items-center justify-between border-b border-violet-500 text-white"
		>
			<Link href="/">
				<div className="h-10 w-24 sm:w-36">
					<Logo className="h-full w-full" viewBox="0 0 503 104" />
				</div>
			</Link>
			<HeaderNavigation>
				<ActiveLink href="/" activeClassName={ACTIVE_CLASS_NAME}>
					Jak korzystać?
				</ActiveLink>
				<ActiveLink href="/foo" activeClassName={ACTIVE_CLASS_NAME}>
					Autorzy
				</ActiveLink>
				<a href="https://www.facebook.com/DevFAQ" target="_blank" rel="noreferrer">
					FaceBook
				</a>
				<ActiveLink href="#" activeClassName={ACTIVE_CLASS_NAME}>
					Zaloguj
				</ActiveLink>
			</HeaderNavigation>
		</Container>
	</div>
);
