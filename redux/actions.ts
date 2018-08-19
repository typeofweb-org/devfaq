import { ActionsUnion, createAction } from './types';
import { LevelKey } from '../constants/level';
import { Question } from './reducers/questions';
import { RouteDetails, AppStore, GetInitialPropsContext } from '../utils/types';
import { Api } from '../services/Api';
import { getTechnology } from './selectors/selectors';
import { AuthData } from './reducers/auth';
import { TechnologyKey } from '../constants/technology-icon-items';

export type AsyncAction<R = any> = (
  dispatch: AppStore['dispatch'],
  getState: AppStore['getState']
) => R;

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

  DELETE_QUESTION = 'DELETE_QUESTION',

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
  uiOpenAddQuestionConfirmationModal: () =>
    createAction(ActionTypes.UI_OPEN_ADD_QUESTION_CONFIRMATION_MODAL),
  uiCloseAddQuestionConfirmationModal: () =>
    createAction(ActionTypes.UI_CLOSE_ADD_QUESTION_CONFIRMATION_MODAL),
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
  fetchQuestionsSuccess: (questions: Question[]) =>
    createAction(ActionTypes.FETCH_QUESTIONS, { data: questions }),

  deleteQuestionStarted: () => createAction(ActionTypes.DELETE_QUESTION, {}),
  deleteQuestionError: (error: Error) => createAction(ActionTypes.DELETE_QUESTION, { error }),
  deleteQuestionSuccess: (id: Question['id']) => createAction(ActionTypes.DELETE_QUESTION, { id }),

  loginStarted: () => createAction(ActionTypes.LOGIN_STARTED),
  loginError: (error?: Error) => createAction(ActionTypes.LOGIN_ERROR, error),
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
      .then(data => dispatch(SyncActionCreators.fetchQuestionsSuccess(data)))
      .catch(err => dispatch(SyncActionCreators.fetchQuestionsError(err)));
  },

  fetchQuestionsForAdmin: (
    options: {
      technology?: TechnologyKey;
      selectedLevels: LevelKey[];
      status: 'pending' | 'accepted';
    },
    ctx?: GetInitialPropsContext
  ): AsyncAction => dispatch => {
    dispatch(SyncActionCreators.fetchQuestionsStarted());
    const { technology, selectedLevels, status } = options;
    return Api.getQuestionsForCategoryAndLevelsAndStatus(technology, selectedLevels, status, ctx)
      .then(data => dispatch(SyncActionCreators.fetchQuestionsSuccess(data)))
      .catch(err => dispatch(SyncActionCreators.fetchQuestionsError(err)));
  },

  deleteQuestionForAdmin: (
    id: Question['id'],
    ctx?: GetInitialPropsContext
  ): AsyncAction => dispatch => {
    dispatch(SyncActionCreators.deleteQuestionStarted());
    return Api.deleteQuestion(id, ctx)
      .then(_data => dispatch(SyncActionCreators.deleteQuestionSuccess(id)))
      .catch(err => dispatch(SyncActionCreators.deleteQuestionError(err)));
  },

  logIn: (email: string, password: string, ctx?: GetInitialPropsContext): AsyncAction => (
    dispatch,
    _getState
  ) => {
    dispatch(SyncActionCreators.loginStarted());
    return Api.logIn(email, password, ctx)
      .then(_data => dispatch(AsyncActionCreators.validateToken(ctx)))
      .catch(err => dispatch(SyncActionCreators.loginError(err)));
  },

  validateToken: (ctx?: GetInitialPropsContext): AsyncAction => (dispatch, _getState) => {
    dispatch(SyncActionCreators.loginStarted());
    return Api.getLoggedInUser(ctx)
      .then(data => dispatch(SyncActionCreators.loginSuccess({ user: data })))
      .catch(err => {
        if (err && err.statusCode === 404) {
          return dispatch(SyncActionCreators.loginError(undefined));
        }
        return dispatch(SyncActionCreators.loginError(err));
      });
  },
};

export const ActionCreators = {
  ...SyncActionCreators,
  ...AsyncActionCreators,
};

export type Actions = ActionsUnion<typeof SyncActionCreators>;
