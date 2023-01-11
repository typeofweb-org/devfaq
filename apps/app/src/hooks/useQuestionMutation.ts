import { useMutation } from "@tanstack/react-query";
import {
	createQuestion,
	createQuestionAnswer,
	deleteQuestion,
	deleteQuestionAnswer,
	patchQuestion,
	patchQuestionAnswer,
} from "../services/questions.service";

export const useQuestionMutation = () => {
	const createQuestionMutation = useMutation(createQuestion);
	const deleteQuestionMutation = useMutation(deleteQuestion);
	const patchQuestionMutation = useMutation(patchQuestion);
	const createQuestionAnswerMutation = useMutation(createQuestionAnswer);
	const patchQuestionAnswerMutation = useMutation(patchQuestionAnswer);
	const deleteQuestionAnswerMutation = useMutation(deleteQuestionAnswer);

	return {
		createQuestionMutation,
		deleteQuestionMutation,
		patchQuestionMutation,
		createQuestionAnswerMutation,
		patchQuestionAnswerMutation,
		deleteQuestionAnswerMutation,
	};
};
