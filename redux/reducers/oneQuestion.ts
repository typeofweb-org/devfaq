import { Actions, ActionTypes } from '../actions';
import { ApiResponse } from '../../services/Api';
import { Question } from './questions';

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
