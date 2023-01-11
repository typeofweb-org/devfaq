import { useEffect, useState } from "react";

type UseIsAboveBreakpointArg = {
	breakpoint: number;
};

export const useIsAboveBreakpoint = ({ breakpoint }: UseIsAboveBreakpointArg): boolean => {
	const [state, setState] = useState(false);

	useEffect(() => {
		const handleReasize = () => {
			if (window.innerWidth >= breakpoint) {
				setState(true);
			} else {
				setState(false);
			}
		};

		window.addEventListener("resize", handleReasize);

		return () => window.removeEventListener("resize", handleReasize);
	}, [breakpoint]);

	return state;
};
