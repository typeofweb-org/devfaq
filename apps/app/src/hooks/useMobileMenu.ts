import { useCallback, useEffect, useState } from "react";

type UseMobleMenuProps = {
	initialMenuOpen: boolean;
	maxMobileWidth: number;
};

export const useMobleMenu = ({ initialMenuOpen, maxMobileWidth }: UseMobleMenuProps) => {
	const [isOpen, setIsOpen] = useState(initialMenuOpen);

	const handleResize = useCallback(() => {
		if (window.innerWidth > maxMobileWidth) {
			setIsOpen(false);
			console.log("hello");
		}
	}, [maxMobileWidth]);

	useEffect(() => {
		if (isOpen) {
			window.addEventListener("resize", handleResize);
		}
		return () => window.removeEventListener("resize", handleResize);
	}, [handleResize, isOpen]);

	return { isOpen, setIsOpen };
};
