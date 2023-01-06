import { useMutation } from "@tanstack/react-query";
import {
	createQuestion,
	createQuestionAnswer,
	deleteQuestion,
	deleteQuestionAnswer,
	patchQuestion,
	updateQuestionAnswer,
} from "../services/questions.service";

export const useQuestionMutation = () => {
	const createQuestionMutation = useMutation(createQuestion);
	const deleteQuestionMutation = useMutation(deleteQuestion);
	const patchQuestionMutation = useMutation(patchQuestion);
	const createQuestionAnswerMutation = useMutation(createQuestionAnswer);
	const updateQuestionAnswerMutation = useMutation(updateQuestionAnswer);
	const deleteQuestionAnswerMutation = useMutation(deleteQuestionAnswer);

	return {
		createQuestionMutation,
		deleteQuestionMutation,
		patchQuestionMutation,
		createQuestionAnswerMutation,
		updateQuestionAnswerMutation,
		deleteQuestionAnswerMutation,
	};
};
