import { useMutation } from "@tanstack/react-query";
import { deleteQuestion, patchQuestion } from "../services/questions.service";

export const useQuestionMutation = () => {
	const deleteQuestionMutation = useMutation(deleteQuestion);
	const patchQuestionMutation = useMutation(patchQuestion);

	return { deleteQuestionMutation, patchQuestionMutation };
};
