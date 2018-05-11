import { combineReducers } from 'redux';
import { questions } from './questions';
import { selectedQuestions } from './selectedQuestions';
import { ui } from './ui';
import { selectedLevels } from './selectedLevels';
import { routeDetails } from './routeDetails';

const reducersObj = {
  questions,
  selectedQuestions,
  ui,
  selectedLevels,
  routeDetails,
};
export const reducers = combineReducers(reducersObj as any);

export type AppState = { [K in keyof typeof reducersObj]: ReturnType<typeof reducersObj[K]> };
