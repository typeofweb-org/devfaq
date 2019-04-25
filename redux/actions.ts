import { ActionsUnion, createAction } from './types';
import { LevelKey } from '../constants/level';
import { Question } from './reducers/questions';
import { RouteDetails, AppStore, GetInitialPropsContext } from '../utils/types';
import { Api, ApiResponse } from '../services/Api';
import { getTechnology, getQuestionId, getLoggedInUser } from './selectors/selectors';
import { AuthData } from './reducers/auth';
import { TechnologyKey, SortBy } from '../constants/technology-icon-items';
import { CommonModalProps } from '../components/modals/baseModal/BaseModal';

export type AsyncAction<R = any> = (
  dispatch: AppStore['dispatch'],
  getState: AppStore['getState']
) => R;

declare module 'redux' {
  export interface Dispatch<A extends Action = AnyAction> {
    <T extends A>(action: T): T;
    (asyncAction: AsyncAction): any;
  }
}

export enum ActionTypes {
  UI_OPEN_SIDEBAR = 'UI_OPEN_SIDEBAR',
  UI_CLOSE_SIDEBAR = 'UI_CLOSE_SIDEBAR',
  UI_OPEN_ADD_QUESTION_MODAL = 'UI_OPEN_ADD_QUESTION_MODAL',
  UI_CLOSE_ADD_QUESTION_MODAL = 'UI_CLOSE_ADD_QUESTION_MODAL',
  UI_OPEN_EDIT_QUESTION_MODAL = 'UI_OPEN_EDIT_QUESTION_MODAL',
  UI_CLOSE_EDIT_QUESTION_MODAL = 'UI_CLOSE_EDIT_QUESTION_MODAL',
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

  FETCH_ONE_QUESTION = 'FETCH_ONE_QUESTION',

  DELETE_QUESTION = 'DELETE_QUESTION',

  CREATE_QUESTION = 'CREATE_QUESTION',

  LOGIN_STARTED = 'LOGIN_STARTED',
  LOGIN_ERROR = 'LOGIN_ERROR',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',

  QUESTION_UPVOTED = 'QUESTION_UPVOTED',
  QUESTION_DOWNVOTED = 'QUESTION_DOWNVOTED',
}

const SyncActionCreators = {
  uiOpenSidebar: () => createAction(ActionTypes.UI_OPEN_SIDEBAR),
  uiCloseSidebar: () => createAction(ActionTypes.UI_CLOSE_SIDEBAR),
  uiOpenAddQuestionModal: () => createAction(ActionTypes.UI_OPEN_ADD_QUESTION_MODAL),
  uiCloseAddQuestionModal: () => createAction(ActionTypes.UI_CLOSE_ADD_QUESTION_MODAL),
  uiOpenEditQuestionModal: (question: Question, onClose?: CommonModalProps['onClose']) =>
    createAction(ActionTypes.UI_OPEN_EDIT_QUESTION_MODAL, { question, onClose }),
  uiCloseEditQuestionModal: () => createAction(ActionTypes.UI_CLOSE_EDIT_QUESTION_MODAL),
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

  fetchQuestionsStarted: (abortController?: AbortController) =>
    createAction(ActionTypes.FETCH_QUESTIONS, { abortController }),
  fetchQuestionsError: (error: Error) => createAction(ActionTypes.FETCH_QUESTIONS, { error }),
  fetchQuestionsSuccess: (data: ApiResponse<Question[]>) =>
    createAction(ActionTypes.FETCH_QUESTIONS, { data }),

  fetchOneQuestionStarted: () => createAction(ActionTypes.FETCH_ONE_QUESTION, {}),
  fetchOneQuestionError: (error: Error) => createAction(ActionTypes.FETCH_ONE_QUESTION, { error }),
  fetchOneQuestionSuccess: (data: ApiResponse<Question>) =>
    createAction(ActionTypes.FETCH_ONE_QUESTION, { data }),

  deleteQuestionStarted: () => createAction(ActionTypes.DELETE_QUESTION, {}),
  deleteQuestionError: (error: Error) => createAction(ActionTypes.DELETE_QUESTION, { error }),
  deleteQuestionSuccess: (id: Question['id']) => createAction(ActionTypes.DELETE_QUESTION, { id }),

  loginStarted: () => createAction(ActionTypes.LOGIN_STARTED),
  loginError: (error?: Error) => createAction(ActionTypes.LOGIN_ERROR, error),
  loginSuccess: (authData: AuthData) => createAction(ActionTypes.LOGIN_SUCCESS, authData),

  questionUpvoted: (id: Question['id']) => createAction(ActionTypes.QUESTION_UPVOTED, { id }),
  questionDownvoted: (id: Question['id']) => createAction(ActionTypes.QUESTION_DOWNVOTED, { id }),
};

const AsyncActionCreators = {
  fetchQuestions: (
    page = 1,
    sortBy = undefined as SortBy | undefined,
    ctx?: GetInitialPropsContext
  ): AsyncAction => (dispatch, getState) => {
    const state = getState();

    let abortController: AbortController | undefined;
    if (typeof AbortController !== 'undefined') {
      abortController = new AbortController();
      if (state.questions.abortController) {
        state.questions.abortController.abort();
      }
    }

    dispatch(SyncActionCreators.fetchQuestionsStarted(abortController));

    const technology = getTechnology(state);
    if (!technology) {
      return dispatch(SyncActionCreators.fetchQuestionsError(new Error('Invalid category')));
    }

    return Api.getQuestionsForCategoryAndLevels(
      page,
      sortBy,
      technology,
      state.selectedLevels,
      abortController,
      ctx
    )
      .then(data => dispatch(SyncActionCreators.fetchQuestionsSuccess(data)))
      .catch(err => dispatch(SyncActionCreators.fetchQuestionsError(err)));
  },

  fetchOneQuestion: (ctx?: GetInitialPropsContext): AsyncAction => (dispatch, getState) => {
    const state = getState();

    dispatch(SyncActionCreators.fetchOneQuestionStarted());

    const id = Number(getQuestionId(state));
    if (!id) {
      return dispatch(SyncActionCreators.fetchOneQuestionError(new Error('Invalid id')));
    }

    return Api.getOneQuestion(id, ctx)
      .then(data => dispatch(SyncActionCreators.fetchOneQuestionSuccess(data)))
      .catch(err => dispatch(SyncActionCreators.fetchOneQuestionError(err)));
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
    return Api.getQuestionsForCategoryAndLevelsAndStatus(
      null,
      undefined,
      technology,
      selectedLevels,
      status,
      undefined,
      ctx
    )
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

  logInWithGitHub: (): AsyncAction => (dispatch, _getState) => {
    dispatch(SyncActionCreators.loginStarted());
    Api.logInWithGitHub()
      .then(() => dispatch(AsyncActionCreators.validateToken()))
      .catch(err => dispatch(SyncActionCreators.loginError(err)));
  },

  validateToken: (ctx?: GetInitialPropsContext): AsyncAction => (dispatch, _getState) => {
    dispatch(SyncActionCreators.loginStarted());
    return Api.getLoggedInUser(ctx)
      .then(data => dispatch(SyncActionCreators.loginSuccess({ session: data.data })))
      .catch(err => {
        if (err && err.statusCode === 404) {
          return dispatch(SyncActionCreators.loginError(undefined));
        }
        return dispatch(SyncActionCreators.loginError(err));
      });
  },

  upvoteQuestion: (questionId: Question['id'], ctx?: GetInitialPropsContext): AsyncAction => (
    dispatch,
    getState
  ) => {
    dispatch(SyncActionCreators.questionUpvoted(questionId));
    const state = getState();
    const user = getLoggedInUser(state);
    return Api.upvoteQuestion({ questionId, userId: user!.id }, ctx).catch(err => {
      dispatch(SyncActionCreators.questionDownvoted(questionId));
      throw err;
    });
  },

  downvoteQuestion: (questionId: Question['id'], ctx?: GetInitialPropsContext): AsyncAction => (
    dispatch,
    getState
  ) => {
    dispatch(SyncActionCreators.questionDownvoted(questionId));
    const state = getState();
    const user = getLoggedInUser(state);
    return Api.downvoteQuestion({ questionId, userId: user!.id }, ctx).catch(err => {
      dispatch(SyncActionCreators.questionUpvoted(questionId));
      throw err;
    });
  },
};

export const ActionCreators = {
  ...SyncActionCreators,
  ...AsyncActionCreators,
};

export type Actions = ActionsUnion<typeof SyncActionCreators>;
