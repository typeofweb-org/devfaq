import { Actions, ActionTypes } from '../actions';
import { TechnologyKey } from '../../constants/technology-icon-items';

export type Question = {
  id: number;
  question: string;
  category: TechnologyKey;
  status: string;
  level: string;
  acceptedAt?: string;
};

const intialState: {
  error?: Error;
  data?: Question[];
  isLoading: boolean;
} = { isLoading: false, data: [], error: undefined };

export const questions = (questions = intialState, action: Actions): typeof intialState => {
  switch (action.type) {
    case ActionTypes.FETCH_QUESTIONS:
      return {
        ...action.payload,
        isLoading: !('error' in action.payload) && !('data' in action.payload),
      };
    default:
      return questions;
  }
};
