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
		}
	}, [maxMobileWidth]);

	useEffect(() => {
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [handleResize]);

	return { isOpen, setIsOpen };
};
