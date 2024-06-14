import Link from "next/link";
import VercelIcon from "../../public/powered-by-vercel.svg";
import { Container } from "./Container";

export const Footer = () => (
	<footer className="bg-primary">
		<Container className="flex flex-col items-center justify-center py-5 sm:justify-end">
			<nav className="flex text-sm text-white">
				<ul className="flex list-none flex-wrap justify-center gap-x-7 gap-y-4">
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
			<p className="mt-3 text-lg font-bold not-italic">
				<a
					href="https://vercel.com?utm_source=typeofweb&utm_campaign=oss"
					target="_blank"
					rel="noopener noreferrer"
					className="mt-10 inline-block"
				>
					<VercelIcon className="mx-auto" width={209} height={40} />
				</a>
			</p>
		</Container>
	</footer>
);
