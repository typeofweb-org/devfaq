import Link from "next/link";
import { twMerge } from "tailwind-merge";
import Logo from "../../public/devfaq-logo.svg";
import { Container } from "./Container";
import { ActiveLink } from "./ActiveLink";

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
			<nav
				className={twMerge(
					"fixed top-0 left-0 h-full w-full flex-col items-center justify-center gap-5 bg-violet-600 uppercase",
					"sm:relative sm:flex sm:h-fit sm:w-fit sm:flex-row",
					false ? "flex" : "hidden", // TODO: ADD NAVIGATION STATE
				)}
			>
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
			</nav>
		</Container>
	</div>
);
