import { Actions, ActionTypes } from '../actions';
import { TechnologyKey } from '../../constants/technology-icon-items';
import { LevelKey } from '../../constants/level';
import { isUndefined } from 'lodash';

export interface Question {
  id: number;
  question: string;
  _categoryId: TechnologyKey;
  _levelId: LevelKey;
  acceptedAt?: string;
}

const intialState: {
  error?: Error;
  data?: Question[];
  isLoading: boolean;
  abortController?: AbortController;
} = { isLoading: false, data: [], error: undefined };

export const questions = (questions = intialState, action: Actions): typeof intialState => {
  switch (action.type) {
    case ActionTypes.FETCH_QUESTIONS:
      const wasAborted = 'error' in action.payload && action.payload.error.name === 'AbortError';
      if (wasAborted) {
        return questions;
      }

      return {
        ...questions,
        ...action.payload,
        isLoading: !('error' in action.payload) && !('data' in action.payload),
      };
    case ActionTypes.DELETE_QUESTION:
      const id = 'id' in action.payload ? action.payload.id : undefined;
      return {
        data: isUndefined(id) ? questions.data : (questions.data || []).filter(q => q.id !== id),
        error: 'error' in action.payload ? action.payload.error : undefined,
        isLoading: questions.isLoading,
        abortController: questions.abortController,
      };
    case ActionTypes.UPDATE_ROUTE_STARTED:
      return {
        data: [],
        isLoading: false,
        abortController: questions.abortController,
      };
    default:
      return questions;
  }
};
