import { useMutation } from "@tanstack/react-query";
import { createQuestion, deleteQuestion, patchQuestion } from "../services/questions.service";

export const useQuestionMutation = () => {
	const createQuestionMutation = useMutation(createQuestion);
	const deleteQuestionMutation = useMutation(deleteQuestion);
	const patchQuestionMutation = useMutation(patchQuestion);

	return { createQuestionMutation, deleteQuestionMutation, patchQuestionMutation };
};
