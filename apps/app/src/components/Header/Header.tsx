import Link from "next/link";
import { Container } from "../Container";
import { AppLogo } from "../AppLogo";
import { HeaderNavigation } from "./HeaderNavigation";
import { ActiveNavigationLink } from "./ActiveNagivationLink";
import { DarkModeSwitch } from "./DarkModeSwitch";
import { LoginNavigationLink } from "./LoginNavigationLink";

export const Header = () => (
	<div className="bg-primary">
		<Container
			as="header"
			className="flex h-16 items-center justify-between border-b border-violet-600 text-white"
		>
			<Link href="/">
				<AppLogo />
			</Link>
			<HeaderNavigation>
				<ActiveNavigationLink href="/">Jak korzystać?</ActiveNavigationLink>
				<ActiveNavigationLink href="/foo">Autorzy</ActiveNavigationLink>
				<a href="https://www.facebook.com/DevFAQ" target="_blank" rel="noreferrer">
					FaceBook
				</a>
				<LoginNavigationLink />
				<DarkModeSwitch />
			</HeaderNavigation>
		</Container>
	</div>
);
