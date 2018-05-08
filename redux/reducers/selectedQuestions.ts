import { Actions, ActionTypes } from '../actions';
import { Question } from './questions';
import { TechnologyKey } from '../../constants/technology-icon-items';

type SelectedQuestions = { [key in TechnologyKey]: Question[] };

const initialSelectedQuestions: SelectedQuestions = {
  html: [],
  css: [],
  js: [],
  angular: [],
  react: [],
  git: [],
  other: [],
};

export const selectedQuestions = (
  selectedQuestions = initialSelectedQuestions,
  _action: Actions
) => {
  return selectedQuestions;
};
