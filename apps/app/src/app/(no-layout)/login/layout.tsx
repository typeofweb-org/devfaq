import { ReactNode } from "react";

export default function LoginPageLayout({ children }: { readonly children: ReactNode }) {
	return <div className="absolute top-0 bottom-0 left-0 right-0 bg-primary">{children}</div>;
}
