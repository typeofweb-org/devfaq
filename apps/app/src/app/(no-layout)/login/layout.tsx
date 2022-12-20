import { ReactNode } from "react";

export default function LoginPageLayout({ children }: { readonly children: ReactNode }) {
	return <div className="flex min-h-screen items-center bg-primary">{children}</div>;
}
