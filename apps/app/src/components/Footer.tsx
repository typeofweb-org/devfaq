import Link from "next/link";
import { Container } from "./Container";
import { OpacityElement } from "./OpacityElement";

export const Footer = () => (
	<footer className="bg-primary">
		<Container className="flex items-center justify-center py-5 sm:justify-end">
			<nav className="flex text-sm text-white">
				<ul className="flex list-none flex-wrap justify-center gap-y-4 gap-x-7">
					<li>
						<OpacityElement>
							<Link href="/about">Jak korzystać?</Link>
						</OpacityElement>
					</li>
					<li>
						<OpacityElement>
							<Link href="/regulations">Regulamin</Link>
						</OpacityElement>
					</li>
					<li>
						<OpacityElement>
							<Link href="/authors">Autorzy</Link>
						</OpacityElement>
					</li>
					<li>
						<OpacityElement>
							<a href="https://www.facebook.com/DevFAQ" target="_blank" rel="noreferrer">
								Facebook
							</a>
						</OpacityElement>
					</li>
					<li>
						<OpacityElement>
							<a href="https://typeofweb.com" target="_blank" rel="noreferrer">
								Type of Web
							</a>
						</OpacityElement>
					</li>
				</ul>
			</nav>
		</Container>
	</footer>
);
