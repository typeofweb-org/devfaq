import { useMutation } from "@tanstack/react-query";
import { createQuestion } from "../services/questions.service";

export const useCreateQuestion = () => {
	const createQuestionMutation = useMutation(createQuestion);

	return { createQuestionMutation };
};
