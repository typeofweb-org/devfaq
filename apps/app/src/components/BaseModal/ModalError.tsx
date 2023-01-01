import type { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Error } from "../Error";

export const ModalError = ({ className, ...props }: ComponentProps<typeof Error>) => (
	<Error className={twMerge("-mb-10 mt-3", className)} {...props} />
);
