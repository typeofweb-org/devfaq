import { combineReducers } from 'redux';
import { questions } from './questions';
import { selectedQuestions } from './selectedQuestions';
import { ui } from './ui';

const reducersObj = {
  questions,
  selectedQuestions,
  ui,
};
export const reducers = combineReducers(reducersObj as any);

export type AppState = { [K in keyof typeof reducersObj]: ReturnType<typeof reducersObj[K]> };
