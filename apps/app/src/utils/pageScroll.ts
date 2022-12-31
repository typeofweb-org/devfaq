import "client-only";

const classes = ["overflow-hidden"];

export const lockScroll = (addClasses: string[] = []) => {
	document.body.style.paddingRight = `${window.innerWidth - document.body.offsetWidth}px`;
	document.body.classList.add(...classes, ...addClasses);
};

export const unlockScroll = (removeClasses: string[] = []) => {
	document.body.style.paddingRight = "";
	document.body.classList.remove(...classes, ...removeClasses);
};
