import { Container } from "../Container";
import { AppTitle } from "../AppTitle";
import { HeaderNavigation } from "./HeaderNavigation";
import { DarkModeSwitch } from "./DarkModeSwitch";

export const Header = () => (
	<div className="bg-primary">
		<Container
			as="header"
			className="flex h-16 items-center justify-between border-b border-violet-600 text-white"
		>
			<AppTitle />
			<HeaderNavigation>
				<DarkModeSwitch />
			</HeaderNavigation>
		</Container>
	</div>
);
