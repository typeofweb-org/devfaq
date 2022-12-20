import { usePathname } from "next/navigation";

export const useDefaultQuestionsPathname = () => {
	const pathname = usePathname();
	const defaultPathname = `${pathname?.slice(0, -2) || ""}/1`;

	return { defaultPathname };
};
