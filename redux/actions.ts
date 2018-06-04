import { ActionsUnion, createAction } from './types';
import { LevelKey } from '../constants/level';
import { Question } from './reducers/questions';
import { RouteDetails, AppStore, GetInitialPropsContext } from '../utils/types';
import { Api } from '../services/Api';
import { getTechnology } from './selectors/selectors';
import { AuthData } from './reducers/auth';

export type AsyncAction<R = any> = (dispatch: AppStore['dispatch'], getState: AppStore['getState']) => R;

export enum ActionTypes {
  UI_OPEN_SIDEBAR = 'UI_OPEN_SIDEBAR',
  UI_CLOSE_SIDEBAR = 'UI_CLOSE_SIDEBAR',
  UI_OPEN_ADD_QUESTION_MODAL = 'UI_OPEN_ADD_QUESTION_MODAL',
  UI_CLOSE_ADD_QUESTION_MODAL = 'UI_CLOSE_ADD_QUESTION_MODAL',
  UI_OPEN_ADD_QUESTION_CONFIRMATION_MODAL = 'UI_OPEN_ADD_QUESTION_CONFIRMATION_MODAL',
  UI_CLOSE_ADD_QUESTION_CONFIRMATION_MODAL = 'UI_CLOSE_ADD_QUESTION_CONFIRMATION_MODAL',
  SELECT_LEVEL = 'SELECT_LEVEL',
  DESELECT_LEVEL = 'DESELECT_LEVEL',
  SELECT_QUESTION = 'SELECT_QUESTION',
  DESELECT_QUESTION = 'DESELECT_QUESTION',

  UPDATE_ROUTE_STARTED = 'UPDATE_ROUTE_STARTED',
  UPDATE_ROUTE_ERROR = 'UPDATE_ROUTE_ERROR',
  UPDATE_ROUTE_SUCCESS = 'UPDATE_ROUTE_SUCCESS',

  FETCH_QUESTIONS = 'FETCH_QUESTIONS',

  CREATE_QUESTION = 'CREATE_QUESTION',

  LOGIN_STARTED = 'LOGIN_STARTED',
  LOGIN_ERROR = 'LOGIN_ERROR',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
}

const SyncActionCreators = {
  uiOpenSidebar: () => createAction(ActionTypes.UI_OPEN_SIDEBAR),
  uiCloseSidebar: () => createAction(ActionTypes.UI_CLOSE_SIDEBAR),
  uiOpenAddQuestionModal: () => createAction(ActionTypes.UI_OPEN_ADD_QUESTION_MODAL),
  uiCloseAddQuestionModal: () => createAction(ActionTypes.UI_CLOSE_ADD_QUESTION_MODAL),
  uiOpenAddQuestionConfirmationModal: () => createAction(ActionTypes.UI_OPEN_ADD_QUESTION_CONFIRMATION_MODAL),
  uiCloseAddQuestionConfirmationModal: () => createAction(ActionTypes.UI_CLOSE_ADD_QUESTION_CONFIRMATION_MODAL),
  selectLevel: (level: LevelKey) => createAction(ActionTypes.SELECT_LEVEL, level),
  deselectLevel: (level: LevelKey) => createAction(ActionTypes.DESELECT_LEVEL, level),
  selectQuestion: (q: Question) => createAction(ActionTypes.SELECT_QUESTION, q),
  deselectQuestion: (id: Question['id']) => createAction(ActionTypes.DESELECT_QUESTION, id),

  updateRouteStarted: () => createAction(ActionTypes.UPDATE_ROUTE_STARTED),
  updateRouteError: (error: Error) => createAction(ActionTypes.UPDATE_ROUTE_ERROR, error),
  updateRouteSuccess: (route: RouteDetails, inProgress = false) =>
    createAction(ActionTypes.UPDATE_ROUTE_SUCCESS, { route, inProgress }),

  fetchQuestionsStarted: () => createAction(ActionTypes.FETCH_QUESTIONS, {}),
  fetchQuestionsError: (error: Error) => createAction(ActionTypes.FETCH_QUESTIONS, { error }),
  fetchQuestionsSuccess: (questions: Question[]) => createAction(ActionTypes.FETCH_QUESTIONS, { data: questions }),

  loginStarted: () => createAction(ActionTypes.LOGIN_STARTED),
  loginError: (error: Error) => createAction(ActionTypes.LOGIN_ERROR, error),
  loginSuccess: (authData: AuthData) => createAction(ActionTypes.LOGIN_SUCCESS, authData),
};

const AsyncActionCreators = {
  fetchQuestions: (ctx?: GetInitialPropsContext): AsyncAction => (dispatch, getState) => {
    dispatch(SyncActionCreators.fetchQuestionsStarted());
    const state = getState();
    const technology = getTechnology(state);
    if (!technology) {
      return dispatch(SyncActionCreators.fetchQuestionsError(new Error('Invalid category')));
    }
    return Api.getQuestionsForCategoryAndLevels(technology, state.selectedLevels, ctx)
      .then((data) => dispatch(SyncActionCreators.fetchQuestionsSuccess(data)))
      .catch((err) => dispatch(SyncActionCreators.fetchQuestionsError(err)));
  },

  logIn: (email: string, password: string, ctx?: GetInitialPropsContext): AsyncAction => (dispatch, _getState) => {
    dispatch(SyncActionCreators.loginStarted());
    return Api.logIn(email, password, ctx)
      .then((data) => dispatch(SyncActionCreators.loginSuccess(data)))
      .catch((err) => dispatch(SyncActionCreators.loginError(err)));
  },
};

export const ActionCreators = {
  ...SyncActionCreators,
  ...AsyncActionCreators,
};

export type Actions = ActionsUnion<typeof SyncActionCreators>;
