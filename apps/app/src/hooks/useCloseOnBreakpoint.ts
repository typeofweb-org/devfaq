import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

type UseCloseOnBreakpointProps = {
	initialState: boolean;
	breakpoint: number;
};

export const useCloseOnBreakpoint = ({
	initialState,
	breakpoint,
}: UseCloseOnBreakpointProps): [boolean, Dispatch<SetStateAction<boolean>>] => {
	const [isOpen, setIsOpen] = useState(initialState);

	const handleResize = useCallback(() => {
		if (window.innerWidth >= breakpoint) {
			setIsOpen(false);
		}
	}, [breakpoint]);

	useEffect(() => {
		if (isOpen) {
			window.addEventListener("resize", handleResize);
		}
		return () => window.removeEventListener("resize", handleResize);
	}, [handleResize, isOpen]);

	return [isOpen, setIsOpen];
};
