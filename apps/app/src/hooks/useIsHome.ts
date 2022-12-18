import { usePathname } from "next/navigation";

export const useIsHome = (home = "questions") => {
	const pathname = usePathname();

	if (pathname && pathname.split("/")[1] === home) {
		return true;
	}
	return false;
};
