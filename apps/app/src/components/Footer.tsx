import Link from "next/link";
import { Container } from "./Container";

export const Footer = () => (
	<footer className="bg-primary">
		<Container className="flex items-center justify-center py-5 sm:justify-end">
			<nav className="flex text-sm text-white">
				<ul className="flex list-none flex-wrap justify-center gap-y-4 gap-x-7">
					<li>
						<Link href="/about">Jak korzystać?</Link>
					</li>
					<li>
						<Link href="/regulations">Regulamin</Link>
					</li>
					<li>
						<Link href="/authors">Autorzy</Link>
					</li>
					<li>
						<a href="https://www.facebook.com/DevFAQ" target="_blank" rel="noreferrer">
							Facebook
						</a>
					</li>
					<li>
						<a href="https://typeofweb.com" target="_blank" rel="noreferrer">
							Type of Web
						</a>
					</li>
				</ul>
			</nav>
		</Container>
	</footer>
);
