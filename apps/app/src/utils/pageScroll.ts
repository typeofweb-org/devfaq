import "client-only";

export const lockScroll = () => {
	document.body.style.paddingRight = `${window.innerWidth - document.body.offsetWidth}px`;
	document.body.classList.add("!overflow-hidden");
};

export const unlockScroll = () => {
	document.body.style.paddingRight = "";
	document.body.classList.remove("!overflow-hidden");
};
