import { useMutation } from "@tanstack/react-query";
import {
	createQuestion,
	createQuestionAnswer,
	deleteQuestion,
	patchQuestion,
} from "../services/questions.service";

export const useQuestionMutation = () => {
	const createQuestionMutation = useMutation(createQuestion);
	const deleteQuestionMutation = useMutation(deleteQuestion);
	const patchQuestionMutation = useMutation(patchQuestion);
	const createQuestionAnswerMutation = useMutation(createQuestionAnswer);

	return {
		createQuestionMutation,
		deleteQuestionMutation,
		patchQuestionMutation,
		createQuestionAnswerMutation,
	};
};
