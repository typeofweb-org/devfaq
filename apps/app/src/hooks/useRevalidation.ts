import { useMutation } from "@tanstack/react-query";
import { revalidate } from "../services/revalidation.service";

export const useRevalidation = () => {
	const revalidateMutation = useMutation(revalidate);

	return { revalidateMutation };
};
