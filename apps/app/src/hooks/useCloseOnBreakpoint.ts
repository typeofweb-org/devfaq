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

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= breakpoint) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			window.addEventListener("resize", handleResize);
		}
		return () => window.removeEventListener("resize", handleResize);
	}, [breakpoint, isOpen]);

	return [isOpen, setIsOpen];
};
