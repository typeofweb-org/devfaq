import Link from "next/link";
import { Container } from "./Container";

export const Footer = () => (
	<footer className="bg-primary">
		<Container className="flex items-center justify-center py-5 sm:justify-end">
			<nav className="flex text-sm text-white">
				<ul className="flex list-none flex-wrap justify-center gap-y-4 gap-x-7">
					<li>
						<Link href="/jak-korzystac" className="transition-opacity hover:opacity-80">
							Jak korzystać?
						</Link>
					</li>
					<li>
						<Link href="/regulamin" className="transition-opacity hover:opacity-80">
							Regulamin
						</Link>
					</li>
					<li>
						<Link href="/autorzy" className="transition-opacity hover:opacity-80">
							Autorzy
						</Link>
					</li>
					<li>
						<a
							href="https://www.facebook.com/DevFAQ"
							target="_blank"
							rel="noreferrer"
							className="transition-opacity hover:opacity-80"
						>
							Facebook
						</a>
					</li>
					<li>
						<a
							href="https://typeofweb.com"
							target="_blank"
							rel="noreferrer"
							className="transition-opacity hover:opacity-80"
						>
							Type of Web
						</a>
					</li>
				</ul>
			</nav>
		</Container>
	</footer>
);
