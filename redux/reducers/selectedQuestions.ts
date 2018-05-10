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
      return selectedQuestions.filter((question) => question.id !== action.payload.id);
    default:
      return selectedQuestions;
  }
};
