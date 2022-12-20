import { ReactNode } from "react";
import { ActiveLink } from "../ActiveLink";
import { Container } from "../Container";
import { PrivateElement } from "../PrivateElement";
import { AddQuestionButton } from "./AddQuestionButton";

type CtaHeaderActiveLinkProps = Readonly<{
	href: string;
	children: ReactNode;
}>;

const CtaHeaderActiveLink = (props: CtaHeaderActiveLinkProps) => (
	<ActiveLink
		activeClassName="font-bold border-white"
		className="flex h-12 grow items-center justify-center border-b-2 border-transparent px-7"
		{...props}
	/>
);

export const CtaHeader = () => (
	<div className="sticky top-0 z-20 bg-primary">
		<Container as="header" className="flex h-14 items-center justify-between">
			<nav className="flex grow gap-4 text-sm text-white sm:grow-0">
				<CtaHeaderActiveLink href="/questions">Lista pytań</CtaHeaderActiveLink>
				<PrivateElement>
					<CtaHeaderActiveLink href="/admin">Admin</CtaHeaderActiveLink>
				</PrivateElement>
			</nav>
			<AddQuestionButton />
		</Container>
	</div>
);
