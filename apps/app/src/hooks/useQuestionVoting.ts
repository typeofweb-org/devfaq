import { useMutation } from "@tanstack/react-query";
import { downvoteQuestion, upvoteQuestion } from "../services/questions.service";

export const useQuestionVoting = () => {
	const upvote = useMutation(upvoteQuestion);
	const downvote = useMutation(downvoteQuestion);

	return { upvote, downvote };
};
