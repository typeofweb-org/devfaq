import { Actions, ActionTypes } from '../actions';
import { TechnologyKey } from '../../constants/technology-icon-items';
import { LevelKey } from '../../constants/level';

export type Question = {
  id: number;
  question: string;
  category: TechnologyKey;
  status: string;
  level: LevelKey;
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
        ...questions,
        ...action.payload,
        isLoading: !('error' in action.payload) && !('data' in action.payload),
      };
    case ActionTypes.UPDATE_ROUTE_STARTED:
      return {
        data: [],
        isLoading: false,
      };
    default:
      return questions;
  }
};
