import { ReactNode } from "react";

export const SelectLabel = ({ children }: { readonly children: ReactNode }) => (
	<label className="flex flex-wrap items-baseline gap-1.5 md:gap-3">{children}</label>
);
