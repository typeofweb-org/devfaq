import { useCallback } from "react";

const classes = ["overflow-hidden", "sm:overflow-scroll"];

export const usePageScroll = () => {
	const lockScroll = useCallback(() => {
		document.body.style.paddingRight = `${window.innerWidth - document.body.offsetWidth}px`;
		document.body.classList.add(...classes);
	}, []);

	const unlockScroll = useCallback(() => {
		document.body.style.paddingRight = "";
		document.body.classList.remove(...classes);
	}, []);

	return { lockScroll, unlockScroll };
};
