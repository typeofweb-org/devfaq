import "client-only";

const classes = ["overflow-hidden"];

export const lockScroll = () => {
	document.body.style.paddingRight = `${window.innerWidth - document.body.offsetWidth}px`;
	document.body.classList.add(...classes);
};

export const unlockScroll = () => {
	document.body.style.paddingRight = "";
	document.body.classList.remove(...classes);
};
