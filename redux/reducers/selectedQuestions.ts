import { Actions, ActionTypes } from '../actions';
import { Question } from './questions';

export const selectedQuestions = (
  selectedQuestions: Question[] = [],
  action: Actions
): Question[] => {
  switch (action.type) {
    case ActionTypes.SELECT_QUESTION:
      return [...selectedQuestions, action.payload];
    case ActionTypes.DESELECT_QUESTION:
      return selectedQuestions.filter(question => question.id !== action.payload);
    case ActionTypes.QUESTION_UPVOTED:
      return selectedQuestions.map(question => {
        if (question.id === action.payload.id) {
          return {
            ...question,
            votesCount: question.votesCount + 1,
            currentUserVotedOn: true,
          };
        }
        return question;
      });
    case ActionTypes.QUESTION_DOWNVOTED:
      return selectedQuestions.map(question => {
        if (question.id === action.payload.id) {
          return {
            ...question,
            votesCount: question.votesCount - 1,
            currentUserVotedOn: false,
          };
        }
        return question;
      });
    default:
      return selectedQuestions;
  }
};
