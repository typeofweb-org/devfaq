import { ActionsUnion, createAction } from './types';
import { LevelKey } from '../constants/level';
import { Question } from './reducers/questions';
import { RouteDetails, AppStore } from '../utils/types';
import { Api } from '../services/Api';
import { getTechnology } from './selectors/selectors';

export type AsyncAction<R = any> = (
  dispatch: AppStore['dispatch'],
  getState: AppStore['getState']
) => R;

export enum ActionTypes {
  UI_OPEN_SIDEBAR = 'UI_OPEN_SIDEBAR',
  UI_CLOSE_SIDEBAR = 'UI_CLOSE_SIDEBAR',
  UI_OPEN_ADD_QUESTION_MODAL = 'UI_OPEN_ADD_QUESTION_MODAL',
  UI_CLOSE_ADD_QUESTION_MODAL = 'UI_CLOSE_ADD_QUESTION_MODAL',
  SELECT_LEVEL = 'SELECT_LEVEL',
  DESELECT_LEVEL = 'DESELECT_LEVEL',
  SELECT_QUESTION = 'SELECT_QUESTION',
  DESELECT_QUESTION = 'DESELECT_QUESTION',
  UPDATE_ROUTE = 'UPDATE_ROUTE',
  FETCH_QUESTIONS = 'FETCH_QUESTIONS',
}

const SyncActionCreators = {
  uiOpenSidebar: () => createAction(ActionTypes.UI_OPEN_SIDEBAR),
  uiCloseSidebar: () => createAction(ActionTypes.UI_CLOSE_SIDEBAR),
  uiOpenAddQuestionModal: () => createAction(ActionTypes.UI_OPEN_ADD_QUESTION_MODAL),
  uiCloseAddQuestionModal: () => createAction(ActionTypes.UI_CLOSE_ADD_QUESTION_MODAL),
  selectLevel: (level: LevelKey) => createAction(ActionTypes.SELECT_LEVEL, level),
  deselectLevel: (level: LevelKey) => createAction(ActionTypes.DESELECT_LEVEL, level),
  selectQuestion: (q: Question) => createAction(ActionTypes.SELECT_QUESTION, q),
  deselectQuestion: (q: Question) => createAction(ActionTypes.DESELECT_QUESTION, q),
  updateRoute: (routeDetails: RouteDetails) => createAction(ActionTypes.UPDATE_ROUTE, routeDetails),
  fetchQuestionsStarted: () => createAction(ActionTypes.FETCH_QUESTIONS, {}),
  fetchQuestionsError: (error: Error) => createAction(ActionTypes.FETCH_QUESTIONS, { error }),
  fetchQuestionsSuccess: (questions: Question[]) =>
    createAction(ActionTypes.FETCH_QUESTIONS, { data: questions }),
};

const AsyncActionCreators = {
  fetchQuestions: (): AsyncAction => (dispatch, getState) => {
    dispatch(SyncActionCreators.fetchQuestionsStarted());
    const state = getState();
    const technology = getTechnology(state);
    if (!technology) {
      return dispatch(SyncActionCreators.fetchQuestionsError(new Error('Invalid category')));
    }
    return Api.getQuestionsForCategoryAndLevels(technology, state.selectedLevels)
      .then((data) => dispatch(SyncActionCreators.fetchQuestionsSuccess(data)))
      .catch((err) => dispatch(SyncActionCreators.fetchQuestionsError(err)));
  },
};

export const ActionCreators = {
  ...SyncActionCreators,
  ...AsyncActionCreators,
};

export type Actions = ActionsUnion<typeof SyncActionCreators>;
