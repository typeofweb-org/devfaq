import "client-only";

const classes = ["overflow-hidden", "sm:overflow-auto"];

export const lockScroll = () => {
	document.body.classList.add(...classes);
};

export const unlockScroll = () => {
	document.body.classList.remove(...classes);
};
