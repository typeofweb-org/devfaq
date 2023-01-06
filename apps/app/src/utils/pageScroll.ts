import "client-only";

type PropsType = {
	mobileOnly: boolean;
	preventLayoutShift: boolean;
};

export const lockScroll = ({ mobileOnly, preventLayoutShift }: PropsType) => {
	if (preventLayoutShift) {
		document.body.style.paddingRight = `${window.innerWidth - document.body.offsetWidth}px`;
	}

	if (mobileOnly) {
		document.body.classList.add("overflow-hidden", "sm:overflow-auto");
	} else {
		document.body.classList.add("!overflow-hidden");
	}
};

export const unlockScroll = ({ mobileOnly, preventLayoutShift }: PropsType) => {
	if (preventLayoutShift) {
		document.body.style.paddingRight = "";
	}

	if (mobileOnly) {
		document.body.classList.remove("overflow-hidden", "sm:overflow-auto");
	} else {
		document.body.classList.remove("!overflow-hidden");
	}
};
