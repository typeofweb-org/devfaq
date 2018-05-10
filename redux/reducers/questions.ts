import { Actions } from '../actions';
import { TechnologyKey } from '../../constants/technology-icon-items';

export type Question = {
  id: number;
  question: string;
  category: TechnologyKey;
  status: string;
  level: string;
  acceptedAt?: string;
};

export const questions = (questions: Question[] = [], _action: Actions) => {
  return questions;
};
