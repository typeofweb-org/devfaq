import { combineReducers } from 'redux';

import { auth } from './auth';
import { oneQuestion } from './oneQuestion';
import { questions } from './questions';
import { routeDetails } from './routeDetails';
import { selectedLevels } from './selectedLevels';
import { selectedQuestions } from './selectedQuestions';
import { ui } from './ui';

const reducersObj = {
  questions,
  oneQuestion,
  selectedQuestions,
  ui,
  selectedLevels,
  routeDetails,
  auth,
};
export const reducers = combineReducers(reducersObj);

export type AppState = { [K in keyof typeof reducersObj]: ReturnType<typeof reducersObj[K]> };
