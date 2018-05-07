import { Actions, ActionTypes } from '../actions';
import { Question } from './questions';

export enum Technology {
  html = 'HTML',
  css = 'CSS',
  js = 'JS',
  angular = 'Angular',
  react = 'React',
  git = 'GIT',
  other = 'Inne',
}

export type TechnologyKey = keyof typeof Technology;

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
