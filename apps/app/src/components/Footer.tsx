import Link from "next/link";
import { Container } from "./Container";

export const Footer = () => (
	<footer className="bg-primary dark:bg-violet-800">
		<Container className="flex h-14 items-center justify-center sm:justify-end">
			<nav className="flex flex-wrap justify-center gap-x-7 text-sm text-white">
				<Link href="/about">Jak korzystać?</Link>
				<Link href="/regulations">Regulamin</Link>
				<Link href="/authors">Autorzy</Link>
				<a href="https://www.facebook.com/DevFAQ" target="_blank" rel="noreferrer">
					Facebook
				</a>
				<a href="https://typeofweb.com" target="_blank" rel="noreferrer">
					Type of Web
				</a>
			</nav>
		</Container>
	</footer>
);
