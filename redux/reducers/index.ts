import { combineReducers } from 'redux';
import { questions } from './questions';
import { selectedQuestions } from './selectedQuestions';
import { ui } from './ui';
import { selectedLevels } from './selectedLevels';
import { routeDetails } from './routeDetails';
import { auth } from './auth';

const reducersObj = {
  questions,
  selectedQuestions,
  ui,
  selectedLevels,
  routeDetails,
  auth,
};
export const reducers = combineReducers(reducersObj);

export type AppState = { [K in keyof typeof reducersObj]: ReturnType<typeof reducersObj[K]> };
