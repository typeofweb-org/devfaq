import Link from "next/link";

const LINK_CLASS_NAME = "hidden sm:inline";

export const Footer = () => (
	<footer className="flex h-14 items-center justify-center bg-violet-700 dark:bg-violet-800 sm:justify-end">
		<nav className="flex gap-7 text-sm text-white">
			<Link href="/about" className={LINK_CLASS_NAME}>
				Jak korzystać?
			</Link>
			<Link href="/regulations">Regulamin</Link>
			<Link href="/authors" className={LINK_CLASS_NAME}>
				Autorzy
			</Link>
			<a
				href="https://www.facebook.com/DevFAQ"
				target="_blank"
				rel="noreferrer"
				className={LINK_CLASS_NAME}
			>
				Facebook
			</a>
			<a href="https://typeofweb.com" target="_blank" rel="noreferrer">
				Type of Web
			</a>
		</nav>
	</footer>
);
