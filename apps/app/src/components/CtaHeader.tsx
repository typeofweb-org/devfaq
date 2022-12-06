import { ComponentProps } from "react";
import { ActiveLink } from "./ActiveLink";
import { Button } from "./Button/Button";
import { Container } from "./Container";

type CtaHeaderActiveLinkProps = Omit<
	ComponentProps<typeof ActiveLink>,
	"activeClassName" | "className"
>;

const CtaHeaderActiveLink = (props: CtaHeaderActiveLinkProps) => (
	<ActiveLink
		activeClassName="font-bold border-white"
		className="flex h-12 grow items-center justify-center border-b-2 border-transparent px-7"
		{...props}
	/>
);

export const CtaHeader = () => (
	<div className="sticky top-0 bg-primary">
		<Container as="header" className="flex h-14 items-center justify-between">
			<nav className="flex grow gap-4 text-sm text-white sm:grow-0">
				<CtaHeaderActiveLink href="/">Lista pytań</CtaHeaderActiveLink>
				<CtaHeaderActiveLink href="/foo">Wybrane pytania</CtaHeaderActiveLink>
			</nav>
			<Button variant="brandingInverse" className="hidden sm:inline-block">
				Dodaj pytanie
			</Button>
		</Container>
	</div>
);
