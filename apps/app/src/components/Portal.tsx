import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const Portal = ({ children }: { readonly children: ReactNode }) => {
	const bodyRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		bodyRef.current = document.body;
	}, []);

	return bodyRef.current && createPortal(children, bodyRef.current);
};
