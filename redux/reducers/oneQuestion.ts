import { Actions, ActionTypes } from '../actions';
import { TechnologyKey } from '../../constants/technology-icon-items';
import { LevelKey } from '../../constants/level';
import { ApiResponse } from '../../services/Api';

export interface Question {
  id: number;
  question: string;
  _categoryId: TechnologyKey;
  _levelId: LevelKey;
  acceptedAt?: string;
}

const intialState: {
  error?: Error;
  data?: ApiResponse<Question>;
  isLoading: boolean;
} = { isLoading: false, data: undefined, error: undefined };

export const oneQuestion = (oneQuestion = intialState, action: Actions): typeof intialState => {
  switch (action.type) {
    case ActionTypes.FETCH_ONE_QUESTION:
      return {
        ...oneQuestion,
        ...action.payload,
        isLoading: !('error' in action.payload) && !('data' in action.payload),
      };
    case ActionTypes.UPDATE_ROUTE_STARTED:
      return {
        data: undefined,
        isLoading: false,
      };
    default:
      return oneQuestion;
  }
};
