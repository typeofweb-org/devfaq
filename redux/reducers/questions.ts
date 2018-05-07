import { Actions, ActionTypes } from '../actions';

export type Question = {
  id: string;
};

export const questions = (questions: Question[] = [], _action: Actions) => {
  return questions;
};
