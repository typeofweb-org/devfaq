import { useEffect } from "react";

export const useOnPressKey = (triggerKey: string, handler: () => void) => {
	useEffect(() => {
		const handlePressKey = ({ key }: KeyboardEvent) => {
			if (key === triggerKey) {
				handler();
			}
		};

		window.addEventListener("keydown", handlePressKey);

		return () => window.removeEventListener("keydown", handlePressKey);
	}, [handler, triggerKey]);
};
