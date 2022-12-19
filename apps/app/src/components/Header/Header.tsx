import { Container } from "../Container";
import { AppTitle } from "../AppTitle";
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
			<AppTitle />
			<HeaderNavigation>
				<ActiveNavigationLink href="/about">Jak korzystać?</ActiveNavigationLink>
				<ActiveNavigationLink href="/authors">Autorzy</ActiveNavigationLink>
				<a href="https://www.facebook.com/DevFAQ" target="_blank" rel="noreferrer">
					Facebook
				</a>
				<div className="sm:w-14">
					<LoginNavigationLink />
				</div>
				<DarkModeSwitch />
			</HeaderNavigation>
		</Container>
	</div>
);
