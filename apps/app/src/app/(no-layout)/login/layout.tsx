import { ReactNode } from "react";

export default function LoginPageLayout({ children }: { readonly children: ReactNode }) {
	return <div className="flex min-h-full min-h-[100dvh] items-center bg-primary">{children}</div>;
}
