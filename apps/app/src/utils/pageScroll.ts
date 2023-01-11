import "client-only";

export const lockScroll = ({ mobileOnly }: { mobileOnly: boolean }) => {
	// @todo remove this if statement when safari start support 'scrollbar-gutter' css property
	if (navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome")) {
		document.body.style.paddingRight = `${window.innerWidth - document.body.offsetWidth}px`;
	}

	if (mobileOnly) {
		document.body.classList.add("overflow-hidden", "sm:overflow-y-auto");
	} else {
		document.body.classList.add("!overflow-hidden");
	}
};

export const unlockScroll = ({ mobileOnly }: { mobileOnly: boolean }) => {
	// @todo remove this if statement when safari start support 'scrollbar-gutter' css property
	if (navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome")) {
		document.body.style.paddingRight = "";
	}

	if (mobileOnly) {
		document.body.classList.remove("overflow-hidden", "sm:overflow-y-auto");
	} else {
		document.body.classList.remove("!overflow-hidden");
	}
};
