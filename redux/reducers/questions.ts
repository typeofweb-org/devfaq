import { Actions, ActionTypes } from '../actions';

export type Question = {
  id: number;
  question: string;
  category: string;
  status: string;
  level: string;
  acceptedAt?: string;
};

export const questions = (questions: Question[] = [], _action: Actions) => {
  return questions;
};
