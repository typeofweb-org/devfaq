import { ReactNode } from "react";
import { Container } from "../../../components/Container";

export default function AdminPageLayout({ children }: { readonly children: ReactNode }) {
	return (
		<Container as="main" className="flex flex-1 flex-col items-center gap-6 py-6">
			{children}
		</Container>
	);
}
