import { ReactNode } from "react";

export default function LoginPageLayout({ children }: { readonly children: ReactNode }) {
	return <div className="flex min-h-[100dvh] min-h-full items-center bg-primary">{children}</div>;
}
