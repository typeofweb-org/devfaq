import "client-only";

export const lockScroll = (mobileOnly = false) => {
	document.body.style.paddingRight = `${window.innerWidth - document.body.offsetWidth}px`;

	if (mobileOnly) {
		document.body.classList.add("overflow-hidden", "sm:overflow-auto");
		return;
	}

	document.body.classList.add("forceLockScroll");
};

export const unlockScroll = (mobileOnly = false) => {
	document.body.style.paddingRight = "";

	if (mobileOnly) {
		document.body.classList.remove("overflow-hidden", "sm:overflow-auto");
		return;
	}

	document.body.classList.remove("forceLockScroll");
};
