import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useIsHome = (home = "questions") => {
	const [isHome, setIsHome] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		if (pathname && pathname.split("/")[1] === home) {
			setIsHome(true);
		}
	}, [pathname, home]);

	return { isHome };
};
